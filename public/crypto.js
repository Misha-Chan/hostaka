/*
 * Hostaka E2E encryption helper (Web Crypto API).
 *
 * Design (deliberately simple, documented trade-offs):
 *  - Each device generates a P-256 ECDH keypair once, stored in IndexedDB.
 *    The private key never leaves the device / is never sent to the server.
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
 * Public API (all async, all return Promises):
 *   HostakaCrypto.getMyPublicKeyBase64()      -> string
 *   HostakaCrypto.ensureKeysRegistered()      -> void (uploads public key once per device)
 *   HostakaCrypto.getSharedKeyFor(username)   -> CryptoKey|null (null if peer has no key yet)
 *   HostakaCrypto.encryptText(sharedKey, text)-> { ciphertext, iv }   (both base64 strings)
 *   HostakaCrypto.decryptText(sharedKey, ciphertext, iv) -> string (throws on failure)
 */
(function () {
  if (window.HostakaCrypto) return;

  var DB_NAME = 'hostaka_keys';
  var STORE = 'keypair';
  var KEY_ID = 'device';

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

  var _keyPairPromise = null;
  function getOrCreateKeyPair() {
    if (_keyPairPromise) return _keyPairPromise;
    _keyPairPromise = (async function () {
      var db = await openDb();
      var existing = await idbGet(db, KEY_ID);
      if (existing && existing.publicKey && existing.privateKey) {
        return existing;
      }
      var pair = await crypto.subtle.generateKey(
        { name: 'ECDH', namedCurve: 'P-256' },
        true, // extractable — simplest approach; keys never leave this origin's IndexedDB anyway
        ['deriveKey', 'deriveBits']
      );
      var rec = { publicKey: pair.publicKey, privateKey: pair.privateKey };
      await idbSet(db, KEY_ID, rec);
      return rec;
    })();
    return _keyPairPromise;
  }

  async function getMyPublicKeyBase64() {
    var kp = await getOrCreateKeyPair();
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
      var token = localStorage.getItem('hostaka_token') || '';
      await fetch('/api/keys/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ publicKey: b64 }),
      });
      sessionStorage.setItem('hostaka_pubkey_registered', b64);
      _registered = true;
    } catch (e) {
      console.error('HostakaCrypto: failed to register public key', e);
    }
  }

  var _peerKeyCache = {}; // username -> CryptoKey (derived shared AES key) | null
  async function getSharedKeyFor(username) {
    if (Object.prototype.hasOwnProperty.call(_peerKeyCache, username)) {
      return _peerKeyCache[username];
    }
    try {
      var token = localStorage.getItem('hostaka_token') || '';
      var res = await fetch('/api/keys/' + encodeURIComponent(username), {
        headers: { 'Authorization': 'Bearer ' + token },
      });
      if (!res.ok) { _peerKeyCache[username] = null; return null; }
      var data = await res.json();
      if (!data.publicKey) { _peerKeyCache[username] = null; return null; }

      var kp = await getOrCreateKeyPair();
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
      console.error('HostakaCrypto: failed to derive shared key for', username, e);
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

  window.HostakaCrypto = {
    getMyPublicKeyBase64: getMyPublicKeyBase64,
    ensureKeysRegistered: ensureKeysRegistered,
    getSharedKeyFor: getSharedKeyFor,
    encryptText: encryptText,
    decryptText: decryptText,
  };
})();
