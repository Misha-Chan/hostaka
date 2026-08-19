/*
 * Hostaka E2E encryption helper (Web Crypto API).
 *
 * Design (deliberately simple, documented trade-offs):
 *  - Each ACCOUNT has exactly ONE P-256 ECDH keypair ("identity"). It is
 *    cached in this browser origin's IndexedDB once known, but it is no
 *    longer *generated* on every origin/device independently (see bug
 *    note below) — it is either created once (first-ever setup) or
 *    restored from an encrypted backup (see PIN section).
 *  - The public key is uploaded to the server so other users can fetch it
 *    and derive a shared secret with you.
 *  - For a given conversation, both sides derive the SAME AES-GCM key via
 *    ECDH(myPrivateKey, theirPublicKey) + HKDF. This is a static shared key
 *    per pair of users (no forward secrecy / ratcheting like Signal — that
 *    would need a much larger key-management system). It still means the
 *    server (and anyone with DB access) only ever sees ciphertext.
 *  - Scope: 1:1 chat messages only. Group messages are NOT covered by this
 *    pass — group E2E needs per-member key wrapping and is a larger,
 *    separate piece of work.
 *
 * ---------------------------------------------------------------------
 * BUG FIX — "old messages become unreadable after a session change":
 * ---------------------------------------------------------------------
 * IndexedDB (where the private key lives) is scoped per browser *origin*.
 * hostaka.fun and orbithub.hostaka.fun are different origins. The old code
 * called getOrCreateKeyPair() everywhere, and it silently GENERATED a new
 * keypair whenever none was found locally — which happens on every new
 * origin, every new device, or any time local storage is cleared. Each
 * newly-generated keypair got registered as *the* account's public key on
 * the server (there's only one public_key column per user), overwriting
 * whatever the other origin/device had registered. Once that happens, the
 * shared AES key derived for OLDER messages can never be reconstructed —
 * that shared secret depended on a private key that no longer exists
 * anywhere. This isn't fixable after the fact; it has to be prevented.
 *
 * The fix: this file now only ever generates a brand-new keypair the very
 * first time an account sets up encryption (setupPin). Every other
 * origin/device that doesn't have the key locally must restore the exact
 * SAME keypair via the PIN-protected backup below, instead of generating
 * its own. That keeps exactly one identity per account, so a "session
 * change" (new origin, new device, cleared storage) never causes key
 * collisions again.
 *
 * ---------------------------------------------------------------------
 * PIN-protected key backup:
 * ---------------------------------------------------------------------
 * The account's private key is wrapped client-side with an AES-256-GCM key
 * derived from the user's 6-digit PIN (PBKDF2-SHA256, 600k iterations, a
 * random per-user salt) and stored on the server as ciphertext only — the
 * server never sees the PIN or the unwrapped key. A short "verifier" (a
 * hash of the derived key) lets the server confirm a PIN attempt was
 * correct *before* releasing the wrapped blob, and the server rate-limits
 * that check (see server.js), which meaningfully blocks online guessing.
 *
 * Honest limit: a 6-digit PIN only has 1,000,000 possible values. The slow
 * KDF raises the cost of guessing a lot, and the server-side lockout stops
 * anyone from brute-forcing it through the API — but if the database
 * itself is ever fully compromised, an attacker with enough compute could
 * still eventually brute-force a specific user's PIN offline. That's a
 * fundamental property of short PINs, not something any amount of client
 * code can fully close. If you want a stronger guarantee later, offer
 * users the option of a longer alphanumeric recovery phrase instead of 6
 * digits.
 *
 * Public API (all async, all return Promises unless noted):
 *   HostakaCrypto.getMyPublicKeyBase64()      -> string
 *   HostakaCrypto.ensureKeysRegistered()      -> void (uploads public key once per device)
 *   HostakaCrypto.getSharedKeyFor(username)   -> CryptoKey|null (null if peer has no key yet)
 *   HostakaCrypto.encryptText(sharedKey, text)-> { ciphertext, iv }   (both base64 strings)
 *   HostakaCrypto.decryptText(sharedKey, ciphertext, iv) -> string (throws on failure)
 *   HostakaCrypto.getIdentityStatus()  -> { status: 'ready'|'needs_setup'|'needs_unlock', locked?, lockedUntil? }
 *   HostakaCrypto.setupPin(pin)        -> true (creates identity if needed, wraps+uploads backup)
 *   HostakaCrypto.unlockWithPin(pin)   -> true (PIN correct, identity restored) | false (PIN wrong)
 *                                          throws { locked: true, lockedUntil } if rate-limited
 */
(function () {
  if (window.HostakaCrypto) return;

  var DB_NAME = 'hostaka_keys';
  var STORE = 'keypair';
  var KEY_ID = 'device';
  var PIN_KDF_ITERATIONS = 600000; // OWASP-recommended floor for PBKDF2-SHA256 (2023 guidance)

  function b64FromBuf(buf) {
    var bytes = new Uint8Array(buf);
    var bin = '';
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }
  function bufFromB64(b64) {
    var bin = atob(b64);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes.buffer;
  }
  function randomBytes(n) { return crypto.getRandomValues(new Uint8Array(n)); }

  function openDb() {
    return new Promise(function (resolve, reject) {
      var req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = function () {
        req.result.createObjectStore(STORE);
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
  }

  function idbGet(db, key) {
    return new Promise(function (resolve, reject) {
      var tx = db.transaction(STORE, 'readonly');
      var r = tx.objectStore(STORE).get(key);
      r.onsuccess = function () { resolve(r.result || null); };
      r.onerror = function () { reject(r.error); };
    });
  }
  function idbSet(db, key, value) {
    return new Promise(function (resolve, reject) {
      var tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(value, key);
      tx.oncomplete = function () { resolve(); };
      tx.onerror = function () { reject(tx.error); };
    });
  }

  function authToken() { return localStorage.getItem('hostaka_token') || ''; }

  // ---- local identity cache (never silently generates — see bug note above) ----
  var _keyPairPromise = null;
  async function getLocalIdentity() {
    if (_keyPairPromise) return _keyPairPromise;
    var db = await openDb();
    var existing = await idbGet(db, KEY_ID);
    if (existing && existing.publicKey && existing.privateKey) {
      _keyPairPromise = Promise.resolve(existing);
      return existing;
    }
    return null;
  }

  async function hasLocalIdentity() {
    return !!(await getLocalIdentity());
  }

  // Only ever called from setupPin(), and only when no local identity and
  // no server-side backup exist yet — i.e. genuinely the first time this
  // account turns encryption on, anywhere.
  async function generateNewLocalIdentity() {
    var db = await openDb();
    var pair = await crypto.subtle.generateKey(
      { name: 'ECDH', namedCurve: 'P-256' },
      true, // extractable — needed so we can wrap it into the PIN backup
      ['deriveKey', 'deriveBits']
    );
    var rec = { publicKey: pair.publicKey, privateKey: pair.privateKey };
    await idbSet(db, KEY_ID, rec);
    _keyPairPromise = Promise.resolve(rec);
    return rec;
  }

  async function storeRestoredIdentity(publicKey, privateKey) {
    var db = await openDb();
    var rec = { publicKey: publicKey, privateKey: privateKey };
    await idbSet(db, KEY_ID, rec);
    _keyPairPromise = Promise.resolve(rec);
    return rec;
  }

  // Used internally wherever the OLD code called getOrCreateKeyPair(). Now
  // it throws instead of generating a mismatched new identity, so callers
  // (chat.js) can catch this and show the PIN unlock/setup UI.
  async function requireLocalIdentity() {
    var id = await getLocalIdentity();
    if (!id) {
      var e = new Error('لا يوجد مفتاح تشفير محلي بعد — يلزم إعداد أو إدخال رمز PIN أولاً');
      e.needsIdentitySetup = true;
      throw e;
    }
    return id;
  }

  async function getMyPublicKeyBase64() {
    var kp = await requireLocalIdentity();
    var raw = await crypto.subtle.exportKey('raw', kp.publicKey);
    return b64FromBuf(raw);
  }

  var _registered = false;
  async function ensureKeysRegistered() {
    if (_registered) return;
    try {
      var b64 = await getMyPublicKeyBase64();
      var already = sessionStorage.getItem('hostaka_pubkey_registered');
      if (already === b64) { _registered = true; return; }
      await fetch('/api/keys/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken() },
        body: JSON.stringify({ publicKey: b64 }),
      });
      sessionStorage.setItem('hostaka_pubkey_registered', b64);
      _registered = true;
    } catch (e) {
      if (!e.needsIdentitySetup) console.error('HostakaCrypto: failed to register public key', e);
    }
  }

  var _peerKeyCache = {}; // username -> CryptoKey (derived shared AES key) | null
  async function getSharedKeyFor(username) {
    if (Object.prototype.hasOwnProperty.call(_peerKeyCache, username)) {
      return _peerKeyCache[username];
    }
    try {
      var res = await fetch('/api/keys/' + encodeURIComponent(username), {
        headers: { 'Authorization': 'Bearer ' + authToken() },
      });
      if (!res.ok) { _peerKeyCache[username] = null; return null; }
      var data = await res.json();
      if (!data.publicKey) { _peerKeyCache[username] = null; return null; }

      var kp = await requireLocalIdentity();
      var theirPublicKey = await crypto.subtle.importKey(
        'raw', bufFromB64(data.publicKey), { name: 'ECDH', namedCurve: 'P-256' }, false, []
      );
      var sharedKey = await crypto.subtle.deriveKey(
        { name: 'ECDH', public: theirPublicKey },
        kp.privateKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      );
      _peerKeyCache[username] = sharedKey;
      return sharedKey;
    } catch (e) {
      if (!e.needsIdentitySetup) console.error('HostakaCrypto: failed to derive shared key for', username, e);
      _peerKeyCache[username] = null;
      return null;
    }
  }

  async function encryptText(sharedKey, text) {
    var iv = crypto.getRandomValues(new Uint8Array(12));
    var enc = new TextEncoder().encode(text);
    var ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, sharedKey, enc);
    return { ciphertext: b64FromBuf(ciphertext), iv: b64FromBuf(iv.buffer) };
  }

  async function decryptText(sharedKey, ciphertextB64, ivB64) {
    var plainBuf = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(bufFromB64(ivB64)) },
      sharedKey,
      bufFromB64(ciphertextB64)
    );
    return new TextDecoder().decode(plainBuf);
  }

  // ================= PIN-protected identity backup =================

  async function deriveKeyFromPin(pin, saltB64, iterations) {
    var salt = new Uint8Array(bufFromB64(saltB64));
    var baseKey = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveKey']
    );
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: salt, iterations: iterations, hash: 'SHA-256' },
      baseKey, { name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']
    );
  }

  // A one-way tag derived from the wrapping key, used so the server can
  // confirm a PIN attempt was correct *before* handing back the wrapped
  // private key — this is what makes server-side rate limiting meaningful.
  async function computeVerifier(aesKey) {
    var raw = await crypto.subtle.exportKey('raw', aesKey);
    var tag = await crypto.subtle.digest('SHA-256',
      concatBuf(raw, new TextEncoder().encode('hostaka-pin-verify-v1')));
    return b64FromBuf(tag);
  }
  function concatBuf(a, b) {
    var au = new Uint8Array(a), bu = new Uint8Array(b);
    var out = new Uint8Array(au.length + bu.length);
    out.set(au, 0); out.set(bu, au.length);
    return out.buffer;
  }

  function assertValidPin(pin) {
    if (!/^\d{6}$/.test(String(pin || ''))) {
      throw new Error('رمز PIN يجب أن يتكوّن من 6 أرقام بالضبط');
    }
  }

  async function pinStatus() {
    var res = await fetch('/api/keys/pin-status', {
      headers: { 'Authorization': 'Bearer ' + authToken() },
    });
    if (!res.ok) return { hasBackup: false };
    return res.json();
  }

  // Creates the account's ONE identity if it doesn't exist yet, then wraps
  // the private key with a PIN-derived key and uploads the encrypted
  // backup + registers the public key. Safe to call again later to change
  // the PIN (re-wraps the SAME existing identity, doesn't create a new one).
  async function setupPin(pin) {
    assertValidPin(pin);
    var kp = (await getLocalIdentity()) || (await generateNewLocalIdentity());

    var pkcs8 = await crypto.subtle.exportKey('pkcs8', kp.privateKey);
    var pubRaw = await crypto.subtle.exportKey('raw', kp.publicKey);
    var bundle = JSON.stringify({ priv: b64FromBuf(pkcs8), pub: b64FromBuf(pubRaw) });

    var salt = randomBytes(16);
    var iv = randomBytes(12);
    var aesKey = await deriveKeyFromPin(pin, b64FromBuf(salt.buffer), PIN_KDF_ITERATIONS);
    var wrapped = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv }, aesKey, new TextEncoder().encode(bundle)
    );
    var verifier = await computeVerifier(aesKey);

    var res = await fetch('/api/keys/pin-setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken() },
      body: JSON.stringify({
        salt: b64FromBuf(salt.buffer),
        iv: b64FromBuf(iv.buffer),
        wrappedKey: b64FromBuf(wrapped),
        iterations: PIN_KDF_ITERATIONS,
        verifier: verifier,
      }),
    });
    if (!res.ok) {
      var errData = await res.json().catch(function () { return {}; });
      throw new Error(errData.error || 'تعذر حفظ رمز PIN على السيرفر');
    }

    _registered = false;
    sessionStorage.removeItem('hostaka_pubkey_registered');
    await ensureKeysRegistered();
    return true;
  }

  // Returns true on success (identity restored locally, old+new messages
  // decryptable again), false if the PIN was simply wrong. Throws an
  // Error with `.locked = true` (and `.lockedUntil`) if rate-limited, and
  // `.noBackup = true` if this account never set up a PIN backup at all.
  async function unlockWithPin(pin) {
    assertValidPin(pin);
    var status = await pinStatus();
    if (!status || !status.hasBackup) {
      var e1 = new Error('لا يوجد نسخة احتياطية محفوظة بهذا الحساب بعد');
      e1.noBackup = true;
      throw e1;
    }
    if (status.locked) {
      var e2 = new Error(status.message || 'تم تجاوز عدد المحاولات المسموحة، حاول لاحقاً');
      e2.locked = true;
      e2.lockedUntil = status.lockedUntil || null;
      throw e2;
    }

    var aesKey = await deriveKeyFromPin(pin, status.salt, status.iterations);
    var verifier = await computeVerifier(aesKey);

    var res = await fetch('/api/keys/pin-unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken() },
      body: JSON.stringify({ verifier: verifier }),
    });

    if (res.status === 429) {
      var data429 = await res.json().catch(function () { return {}; });
      var e3 = new Error(data429.error || 'تم تجاوز عدد المحاولات المسموحة، حاول لاحقاً');
      e3.locked = true;
      e3.lockedUntil = data429.lockedUntil || null;
      throw e3;
    }
    if (res.status === 401) return false; // wrong PIN, attempt was counted server-side

    if (!res.ok) throw new Error('تعذر التحقق من رمز PIN، حاول لاحقاً');

    var data = await res.json(); // { wrappedKey, iv }
    var plainBuf;
    try {
      plainBuf = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: new Uint8Array(bufFromB64(data.iv)) },
        aesKey,
        bufFromB64(data.wrappedKey)
      );
    } catch (e) {
      // السيرفر تحقق من verifier وهو صحيح، فوصول لهون كان لازم ينجح فعلياً؛
      // لو صار خطأ هنا فهو عطل بيانات فعلي وليس رمز PIN خاطئ.
      throw new Error('تعذّرت استعادة المفتاح — البيانات المخزّنة تالفة، يلزم إعادة إعداد PIN جديد');
    }

    var bundle = JSON.parse(new TextDecoder().decode(plainBuf));
    var privateKey = await crypto.subtle.importKey(
      'pkcs8', bufFromB64(bundle.priv), { name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveKey', 'deriveBits']
    );
    var publicKey = await crypto.subtle.importKey(
      'raw', bufFromB64(bundle.pub), { name: 'ECDH', namedCurve: 'P-256' }, true, []
    );
    await storeRestoredIdentity(publicKey, privateKey);

    _peerKeyCache = {}; // أي مفاتيح مشتقة سابقاً (غالباً null) لازم تُحسب من جديد
    _registered = false;
    sessionStorage.removeItem('hostaka_pubkey_registered');
    await ensureKeysRegistered();
    return true;
  }

  // What the UI should show right now: 'ready' (nothing to do), 'needs_setup'
  // (first time ever — generate + ask user to CHOOSE a PIN), or
  // 'needs_unlock' (identity exists on the account, just not in this
  // browser/origin — ask user to ENTER their existing PIN).
  async function getIdentityStatus() {
    if (await hasLocalIdentity()) return { status: 'ready' };
    var ps = await pinStatus();
    if (ps && ps.hasBackup) {
      return { status: 'needs_unlock', locked: !!ps.locked, lockedUntil: ps.lockedUntil || null };
    }
    return { status: 'needs_setup' };
  }

  window.HostakaCrypto = {
    getMyPublicKeyBase64: getMyPublicKeyBase64,
    ensureKeysRegistered: ensureKeysRegistered,
    getSharedKeyFor: getSharedKeyFor,
    encryptText: encryptText,
    decryptText: decryptText,
    hasLocalIdentity: hasLocalIdentity,
    getIdentityStatus: getIdentityStatus,
    setupPin: setupPin,
    unlockWithPin: unlockWithPin,
  };
})();
