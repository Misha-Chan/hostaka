const { createClient } = require('@libsql/client');
const bcrypt = require('bcryptjs');

if (!global._tursoClient) {
  global._tursoClient = createClient({
    url:       process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
}
const db = global._tursoClient;

function rows(r)  { return r.rows.map(row => Object.fromEntries(Object.entries(row))); }
function first(r) { const row = r.rows[0]; return row ? Object.fromEntries(Object.entries(row)) : null; }

async function initDB() {
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS users (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      username     TEXT NOT NULL UNIQUE,
      email        TEXT NOT NULL UNIQUE,
      password     TEXT NOT NULL,
      role         TEXT NOT NULL DEFAULT 'user',
      avatar       TEXT DEFAULT '',
      bio          TEXT DEFAULT '',
      game_id      TEXT DEFAULT '',
      display_name TEXT DEFAULT '',
      cover        TEXT DEFAULT '',
      verified     INTEGER DEFAULT 0,
      suspended       INTEGER DEFAULT 0,
      suspend_reason  TEXT DEFAULT '',
      last_seen    TEXT DEFAULT (datetime('now')),
      created_at   TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS records (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id     INTEGER REFERENCES users(id),
      page_id     INTEGER DEFAULT NULL REFERENCES pages(id),
      publisher   TEXT NOT NULL,
      user_role   TEXT NOT NULL DEFAULT 'Member',
      user_avatar TEXT DEFAULT '',
      content     TEXT NOT NULL,
      image       TEXT DEFAULT '',
      video       TEXT DEFAULT '',
      edited      INTEGER DEFAULT 0,
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS record_reactions (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      record_id INTEGER NOT NULL REFERENCES records(id) ON DELETE CASCADE,
      user_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      emoji     TEXT NOT NULL DEFAULT 'like',
      UNIQUE(record_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS record_comments (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      record_id    INTEGER NOT NULL REFERENCES records(id) ON DELETE CASCADE,
      user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      username     TEXT NOT NULL,
      display_name TEXT DEFAULT '',
      avatar       TEXT DEFAULT '',
      user_role    TEXT DEFAULT 'Member',
      content      TEXT NOT NULL,
      created_at   TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS messages (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      from_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      to_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      from_name  TEXT NOT NULL,
      to_name    TEXT NOT NULL,
      content    TEXT NOT NULL,
      image      TEXT DEFAULT '',
      read       INTEGER NOT NULL DEFAULT 0,
      edited     INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS message_reactions (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      message_id INTEGER NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      emoji      TEXT NOT NULL DEFAULT 'heart',
      UNIQUE(message_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS groups (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL,
      description TEXT DEFAULT '',
      avatar      TEXT DEFAULT '',
      theme       TEXT DEFAULT 'default',
      background  TEXT DEFAULT 'default',
      created_by  INTEGER NOT NULL REFERENCES users(id),
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS group_members (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id  INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
      user_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      nickname  TEXT DEFAULT '',
      role      TEXT NOT NULL DEFAULT 'member',
      joined_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(group_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS group_messages (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id    INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
      user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      from_name   TEXT NOT NULL,
      from_avatar TEXT DEFAULT '',
      content     TEXT NOT NULL,
      image       TEXT DEFAULT '',
      edited      INTEGER NOT NULL DEFAULT 0,
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS group_message_reactions (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      message_id INTEGER NOT NULL REFERENCES group_messages(id) ON DELETE CASCADE,
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      emoji      TEXT NOT NULL DEFAULT 'heart',
      UNIQUE(message_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS verify_requests (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      username   TEXT NOT NULL,
      status     TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id)
    );

    -- ===== جدول المتابعات =====
    CREATE TABLE IF NOT EXISTS follows (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      follower_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      followed_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at  TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(follower_id, followed_id)
    );

    -- ===== جدول الصفحات/القنوات التابعة لحساب =====
    CREATE TABLE IF NOT EXISTS pages (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      username    TEXT NOT NULL UNIQUE,
      name        TEXT NOT NULL,
      avatar      TEXT DEFAULT '',
      cover       TEXT DEFAULT '',
      bio         TEXT DEFAULT '',
      category    TEXT DEFAULT '',
      verified    INTEGER DEFAULT 0,
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_pages_owner ON pages(owner_id);

    -- ===== جدول متابعي الصفحات =====
    CREATE TABLE IF NOT EXISTS page_follows (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      page_id    INTEGER NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(page_id, user_id)
    );

    -- ===== جدول محادثات Shizi AI =====
    CREATE TABLE IF NOT EXISTS shizi_messages (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      role       TEXT NOT NULL DEFAULT 'user',
      content    TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- ===== جدول الإشعارات =====
    CREATE TABLE IF NOT EXISTS notifications (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type         TEXT NOT NULL,
      actor_id     INTEGER REFERENCES users(id),
      actor_name   TEXT DEFAULT '',
      actor_avatar TEXT DEFAULT '',
      record_id    INTEGER,
      comment_id   INTEGER,
      content      TEXT DEFAULT '',
      link         TEXT DEFAULT '',
      read         INTEGER NOT NULL DEFAULT 0,
      created_at   TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, created_at DESC);

    -- ===== جدول الحظر بين المستخدمين =====
    CREATE TABLE IF NOT EXISTS blocks (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      blocked_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, blocked_id)
    );

    -- ===== جدول البلاغات وطلبات الدعم =====
    CREATE TABLE IF NOT EXISTS reports (
      id                 INTEGER PRIMARY KEY AUTOINCREMENT,
      reporter_id        INTEGER REFERENCES users(id) ON DELETE SET NULL,
      reporter_name      TEXT DEFAULT '',
      type               TEXT NOT NULL DEFAULT 'general', -- post | comment | message | user | general
      target_id          INTEGER,
      target_owner_id    INTEGER,
      target_owner_name  TEXT DEFAULT '',
      subject            TEXT DEFAULT '',
      reason             TEXT DEFAULT '',
      status             TEXT NOT NULL DEFAULT 'pending', -- pending | resolved | dismissed
      admin_reply        TEXT DEFAULT '',
      created_at         TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at         TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status, created_at DESC);

    -- ===== جدول طلبات التسجيل المعلّقة (بانتظار تأكيد كود البريد) =====
    CREATE TABLE IF NOT EXISTS pending_registrations (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      email        TEXT NOT NULL UNIQUE,
      username     TEXT NOT NULL,
      password     TEXT NOT NULL,
      code         TEXT NOT NULL,
      attempts     INTEGER NOT NULL DEFAULT 0,
      expires_at   TEXT NOT NULL,
      last_sent_at TEXT NOT NULL DEFAULT (datetime('now')),
      created_at   TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- ===== جدول طلبات استعادة كلمة المرور (كود عبر البريد) =====
    CREATE TABLE IF NOT EXISTS password_resets (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      email        TEXT NOT NULL UNIQUE,
      code         TEXT NOT NULL,
      attempts     INTEGER NOT NULL DEFAULT 0,
      expires_at   TEXT NOT NULL,
      last_sent_at TEXT NOT NULL DEFAULT (datetime('now')),
      created_at   TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- ===== جدول القصص (Stories) =====
    CREATE TABLE IF NOT EXISTS stories (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      media      TEXT NOT NULL,
      media_type TEXT NOT NULL DEFAULT 'image',
      caption    TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      expires_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_stories_expires ON stories(expires_at);
    CREATE INDEX IF NOT EXISTS idx_stories_user ON stories(user_id, created_at DESC);

    -- ===== جدول مشاهدات القصص =====
    CREATE TABLE IF NOT EXISTS story_views (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      story_id   INTEGER NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      viewed_at  TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(story_id, user_id)
    );

    -- ===== جدول طلبات تعديل الحساب (يوزر نيم/بريد/كلمة مرور/حذف) بانتظار تأكيد كود البريد =====
    CREATE TABLE IF NOT EXISTS account_changes (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      purpose      TEXT NOT NULL,
      payload      TEXT NOT NULL DEFAULT '',
      target_email TEXT NOT NULL DEFAULT '',
      code         TEXT NOT NULL,
      attempts     INTEGER NOT NULL DEFAULT 0,
      expires_at   TEXT NOT NULL,
      last_sent_at TEXT NOT NULL DEFAULT (datetime('now')),
      created_at   TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, purpose)
    );
  `);

  // Migrations — إضافة أعمدة مفقودة
  const migrations = [
    "ALTER TABLE users ADD COLUMN avatar       TEXT DEFAULT ''",
    "ALTER TABLE users ADD COLUMN bio          TEXT DEFAULT ''",
    "ALTER TABLE users ADD COLUMN game_id      TEXT DEFAULT ''",
    "ALTER TABLE users ADD COLUMN display_name TEXT DEFAULT ''",
    "ALTER TABLE users ADD COLUMN cover        TEXT DEFAULT ''",
    "ALTER TABLE users ADD COLUMN verified     INTEGER DEFAULT 0",
    "ALTER TABLE users ADD COLUMN suspended      INTEGER DEFAULT 0",
    "ALTER TABLE users ADD COLUMN suspend_reason TEXT DEFAULT ''",
    "ALTER TABLE users ADD COLUMN email_verified INTEGER DEFAULT 1",
    "ALTER TABLE records ADD COLUMN user_id     INTEGER",
    "ALTER TABLE records ADD COLUMN user_role   TEXT DEFAULT 'Member'",
    "ALTER TABLE records ADD COLUMN user_avatar TEXT DEFAULT ''",
    "ALTER TABLE records ADD COLUMN image       TEXT DEFAULT ''",
    "ALTER TABLE records ADD COLUMN video       TEXT DEFAULT ''",  // ✅ عمود الفيديو
    "ALTER TABLE records ADD COLUMN is_reel     INTEGER DEFAULT 0",   // ✅ هل الفيديو ريلز (عمودي)
    "ALTER TABLE records ADD COLUMN video_width  INTEGER DEFAULT 0",  // ✅ عرض الفيديو بالبكسل
    "ALTER TABLE records ADD COLUMN video_height INTEGER DEFAULT 0",  // ✅ ارتفاع الفيديو بالبكسل
    "ALTER TABLE records ADD COLUMN edited      INTEGER DEFAULT 0",  // ✅ تعديل المنشور
    "ALTER TABLE records ADD COLUMN page_id     INTEGER DEFAULT NULL",  // ✅ نشر باسم صفحة/قناة
    "ALTER TABLE users   ADD COLUMN last_seen   TEXT DEFAULT ''",  // ✅ آخر ظهور (تُملأ لاحقاً بقيمة حقيقية)
    "ALTER TABLE messages ADD COLUMN edited     INTEGER NOT NULL DEFAULT 0",  // ✅ تعديل الرسالة
    "ALTER TABLE group_messages ADD COLUMN edited INTEGER NOT NULL DEFAULT 0",  // ✅ تعديل رسالة المجموعة
    "ALTER TABLE record_comments ADD COLUMN display_name TEXT DEFAULT ''",
    "ALTER TABLE record_comments ADD COLUMN avatar       TEXT DEFAULT ''",
    "ALTER TABLE record_comments ADD COLUMN user_role    TEXT DEFAULT 'Member'",
    "ALTER TABLE messages ADD COLUMN image TEXT DEFAULT ''",
    "ALTER TABLE groups ADD COLUMN background TEXT DEFAULT 'default'",
    "CREATE TABLE IF NOT EXISTS verify_requests (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, username TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', created_at TEXT NOT NULL DEFAULT (datetime('now')), UNIQUE(user_id))",
    "CREATE TABLE IF NOT EXISTS message_reactions (id INTEGER PRIMARY KEY AUTOINCREMENT, message_id INTEGER NOT NULL, user_id INTEGER NOT NULL, emoji TEXT NOT NULL DEFAULT 'heart', UNIQUE(message_id, user_id))",
    "CREATE TABLE IF NOT EXISTS shizi_messages (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, role TEXT NOT NULL DEFAULT 'user', content TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')))",
    "CREATE TABLE IF NOT EXISTS pending_registrations (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE, username TEXT NOT NULL, password TEXT NOT NULL, code TEXT NOT NULL, attempts INTEGER NOT NULL DEFAULT 0, expires_at TEXT NOT NULL, last_sent_at TEXT NOT NULL DEFAULT (datetime('now')), created_at TEXT NOT NULL DEFAULT (datetime('now')))",
    "CREATE TABLE IF NOT EXISTS password_resets (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE, code TEXT NOT NULL, attempts INTEGER NOT NULL DEFAULT 0, expires_at TEXT NOT NULL, last_sent_at TEXT NOT NULL DEFAULT (datetime('now')), created_at TEXT NOT NULL DEFAULT (datetime('now')))",
    "CREATE TABLE IF NOT EXISTS stories (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, media TEXT NOT NULL, media_type TEXT NOT NULL DEFAULT 'image', caption TEXT DEFAULT '', created_at TEXT NOT NULL DEFAULT (datetime('now')), expires_at TEXT NOT NULL)",
    "CREATE INDEX IF NOT EXISTS idx_stories_expires ON stories(expires_at)",
    "CREATE INDEX IF NOT EXISTS idx_stories_user ON stories(user_id, created_at DESC)",
    "CREATE TABLE IF NOT EXISTS story_views (id INTEGER PRIMARY KEY AUTOINCREMENT, story_id INTEGER NOT NULL, user_id INTEGER NOT NULL, viewed_at TEXT NOT NULL DEFAULT (datetime('now')), UNIQUE(story_id, user_id))",
    "CREATE TABLE IF NOT EXISTS pages (id INTEGER PRIMARY KEY AUTOINCREMENT, owner_id INTEGER NOT NULL, username TEXT NOT NULL UNIQUE, name TEXT NOT NULL, avatar TEXT DEFAULT '', cover TEXT DEFAULT '', bio TEXT DEFAULT '', category TEXT DEFAULT '', verified INTEGER DEFAULT 0, created_at TEXT NOT NULL DEFAULT (datetime('now')))",
    "CREATE INDEX IF NOT EXISTS idx_pages_owner ON pages(owner_id)",
    "CREATE TABLE IF NOT EXISTS page_follows (id INTEGER PRIMARY KEY AUTOINCREMENT, page_id INTEGER NOT NULL, user_id INTEGER NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')), UNIQUE(page_id, user_id))",
    "ALTER TABLE users ADD COLUMN birth_date TEXT DEFAULT ''",  // ✅ تاريخ الميلاد — صفحة إدارة الحساب
    "ALTER TABLE users ADD COLUMN totp_secret TEXT DEFAULT ''",         // ✅ سر المصادقة الثنائية (TOTP)
    "ALTER TABLE users ADD COLUMN totp_enabled INTEGER DEFAULT 0",      // ✅ هل المصادقة الثنائية مفعّلة
    "ALTER TABLE users ADD COLUMN totp_backup_codes TEXT DEFAULT ''",   // ✅ أكواد الاسترجاع الاحتياطية (JSON، مشفّرة bcrypt)
    "CREATE TABLE IF NOT EXISTS account_changes (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, purpose TEXT NOT NULL, payload TEXT NOT NULL DEFAULT '', target_email TEXT NOT NULL DEFAULT '', code TEXT NOT NULL, attempts INTEGER NOT NULL DEFAULT 0, expires_at TEXT NOT NULL, last_sent_at TEXT NOT NULL DEFAULT (datetime('now')), created_at TEXT NOT NULL DEFAULT (datetime('now')), UNIQUE(user_id, purpose))",
    "CREATE TABLE IF NOT EXISTS saved_posts (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, record_id INTEGER NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')), UNIQUE(user_id, record_id))",  // ✅ حفظ المنشورات/الريلز
    "CREATE INDEX IF NOT EXISTS idx_saved_posts_user ON saved_posts(user_id, created_at DESC)",
    "ALTER TABLE records ADD COLUMN pinned INTEGER DEFAULT 0",       // ✅ تثبيت المنشور في الملف الشخصي
    "ALTER TABLE records ADD COLUMN pinned_at TEXT DEFAULT ''",
    "CREATE TABLE IF NOT EXISTS user_sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, jti TEXT NOT NULL UNIQUE, username TEXT DEFAULT '', device TEXT DEFAULT '', browser TEXT DEFAULT '', os TEXT DEFAULT '', ip TEXT DEFAULT '', location TEXT DEFAULT '', user_agent TEXT DEFAULT '', created_at TEXT DEFAULT '', last_active TEXT DEFAULT '', revoked INTEGER DEFAULT 0)",  // ✅ إدارة الجلسات/الأجهزة (جدول جديد كلياً لتفادي تعارض جدول sessions القديم غير المعروف البنية)
    "CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON user_sessions(user_id, revoked)",
    "CREATE INDEX IF NOT EXISTS idx_user_sessions_jti ON user_sessions(jti)",
    // ✅ خصوصية الحساب: عام/خاص + من يقدر يراسلني + حقول تعريفية إضافية
    "ALTER TABLE users ADD COLUMN is_private INTEGER DEFAULT 0",
    "ALTER TABLE users ADD COLUMN message_privacy TEXT DEFAULT 'everyone'",
    "ALTER TABLE users ADD COLUMN country TEXT DEFAULT ''",
    "ALTER TABLE users ADD COLUMN favorite_song TEXT DEFAULT ''",
    "ALTER TABLE users ADD COLUMN school TEXT DEFAULT ''",
    "ALTER TABLE users ADD COLUMN certificates TEXT DEFAULT ''",
    "CREATE TABLE IF NOT EXISTS close_friends (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, friend_id INTEGER NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')), UNIQUE(user_id, friend_id))",
    "CREATE INDEX IF NOT EXISTS idx_close_friends_user ON close_friends(user_id)",
    "CREATE TABLE IF NOT EXISTS security_events (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, type TEXT NOT NULL, description TEXT DEFAULT '', ip TEXT DEFAULT '', device TEXT DEFAULT '', created_at TEXT NOT NULL DEFAULT (datetime('now')))",  // ✅ تنبيهات الأمان
    "ALTER TABLE security_events ADD COLUMN type TEXT DEFAULT ''",
    "ALTER TABLE security_events ADD COLUMN description TEXT DEFAULT ''",
    "ALTER TABLE security_events ADD COLUMN ip TEXT DEFAULT ''",
    "ALTER TABLE security_events ADD COLUMN device TEXT DEFAULT ''",
    "ALTER TABLE security_events ADD COLUMN created_at TEXT DEFAULT ''",
    "CREATE INDEX IF NOT EXISTS idx_security_events_user ON security_events(user_id, created_at DESC)",
    "ALTER TABLE records ADD COLUMN privacy TEXT DEFAULT 'public'",       // public | private | draft
    "ALTER TABLE records ADD COLUMN scheduled_at TEXT DEFAULT NULL",      // نشر مجدوَل بوقت لاحق
    "ALTER TABLE record_comments ADD COLUMN parent_id INTEGER DEFAULT NULL", // الرد على تعليق
    "ALTER TABLE messages ADD COLUMN reply_to INTEGER DEFAULT NULL",         // الرد على رسالة (دردشة خاصة)
    "ALTER TABLE group_messages ADD COLUMN reply_to INTEGER DEFAULT NULL",  // الرد على رسالة (مجموعة)

    // ✅ تحديث الرسائل: مؤشرات القراءة + الكنى + مؤشر الكتابة + حذف/وسائط المحادثة
    "ALTER TABLE messages ADD COLUMN read_at TEXT DEFAULT NULL",             // وقت قراءة الرسالة (لمؤشر القراءة)
    "ALTER TABLE users ADD COLUMN read_receipts INTEGER DEFAULT 1",         // تفعيل/تعطيل مؤشر القراءة
    "CREATE TABLE IF NOT EXISTS dm_nicknames (id INTEGER PRIMARY KEY AUTOINCREMENT, owner_id INTEGER NOT NULL, target_id INTEGER NOT NULL, nickname TEXT DEFAULT '', created_at TEXT NOT NULL DEFAULT (datetime('now')), UNIQUE(owner_id, target_id))",
    "ALTER TABLE group_members ADD COLUMN last_read_message_id INTEGER DEFAULT 0", // آخر رسالة قرأها العضو في المجموعة
    "CREATE TABLE IF NOT EXISTS typing_status (id INTEGER PRIMARY KEY AUTOINCREMENT, chat_key TEXT NOT NULL, user_id INTEGER NOT NULL, updated_at TEXT NOT NULL DEFAULT (datetime('now')), UNIQUE(chat_key, user_id))",
    "CREATE INDEX IF NOT EXISTS idx_typing_chat ON typing_status(chat_key)",
  ];
  for (const sql of migrations) {
    try { await db.execute(sql); } catch(e) { /* column/table already exists */ }
  }
  // تعبئة قيمة أولية لآخر ظهور لأي مستخدم لم يُحدَّث عموده بعد (بعد إضافة العمود لأول مرة)
  try { await db.execute("UPDATE users SET last_seen = datetime('now') WHERE last_seen IS NULL OR last_seen = ''"); } catch(e) {}

  // Admin — Hostaka
  // ⚠️ يُنشأ حساب الأدمن من متغيرات البيئة مرة واحدة فقط عند عدم وجود
  // أي حساب أدمن بعد. بعد إنشائه، لا تتم إعادة تعيين بريده/كلمة مروره
  // تلقائياً بعد ذلك — يصبح حساباً عادياً بصلاحيات أدمن يمكنك تعديل
  // بريده أو كلمة مروره بحرية (مثلاً من صفحة /manager) دون أن يرجعه
  // السيرفر لقيم متغيرات البيئة عند كل إعادة تشغيل/نشر جديد.
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@hostaka.io';
  const ADMIN_PASS  = process.env.ADMIN_PASS  || 'hostaka-admin-2026';

  const adminExists = await db.execute({ sql:"SELECT id FROM users WHERE role='admin' LIMIT 1", args:[] });
  if (adminExists.rows.length === 0) {
    const hash = bcrypt.hashSync(ADMIN_PASS, 10);
    try {
      await db.execute({
        sql:"INSERT INTO users (username,email,password,role,display_name) VALUES (?,?,?,?,?)",
        args:['admin', ADMIN_EMAIL, hash, 'admin', 'Admin']
      });
      console.log('✅ Admin user created');
    } catch (e) {
      if (e.message?.includes('UNIQUE constraint failed')) {
        console.log('⚠️ Admin email already exists in users table, skipping insert');
      } else {
        throw e;
      }
    }
  }
  console.log('✅ Hostaka DB ready');
}

// ──────────────────────────────────────────────────────────────
//  QUERIES
// ──────────────────────────────────────────────────────────────
const q = {
  // ── Users ──
  getUserByEmail:   (email)    => db.execute({ sql:'SELECT * FROM users WHERE email=?', args:[email] }).then(first),
  getUserById:      (id)       => db.execute({ sql:'SELECT id,username,email,role,avatar,bio,game_id,display_name,cover,verified,suspended,suspend_reason,birth_date,totp_enabled,is_private,message_privacy,country,favorite_song,school,certificates,last_seen,read_receipts,created_at FROM users WHERE id=?', args:[id] }).then(first),
  getUserByIdFull:  (id)       => db.execute({ sql:'SELECT * FROM users WHERE id=?', args:[id] }).then(first),
  touchLastSeen: (id) => db.execute({ sql:"UPDATE users SET last_seen=datetime('now') WHERE id=?", args:[id] }).catch(()=>{}),
  getUserStatus: async (username) => {
    const u = await db.execute({ sql:'SELECT id, last_seen FROM users WHERE username=?', args:[username] }).then(first);
    if (!u) return null;
    return u;
  },
  getPublicProfile: (username, viewerId = null) => {
    return db.execute({ 
      sql: `
        SELECT 
          u.id, u.username, u.display_name, u.avatar, u.bio, u.game_id, u.role, u.verified, u.cover, u.created_at,
          u.is_private, u.message_privacy, u.country, u.favorite_song, u.school, u.certificates, u.read_receipts,
          (SELECT COUNT(*) FROM follows WHERE followed_id = u.id) AS followers_count,
          (SELECT COUNT(*) FROM follows WHERE follower_id = u.id) AS following_count,
          EXISTS (SELECT 1 FROM follows WHERE follower_id = ? AND followed_id = u.id) AS is_following
        FROM users u
        WHERE u.username = ?
      `,
      args: [viewerId || 0, username]
    }).then(first);
  },
  createUser:       (username,email,password) => db.execute({ sql:'INSERT INTO users (username,email,password) VALUES (?,?,?)', args:[username,email,password] }),
  createVerifiedUser: (username,email,password) => db.execute({ sql:'INSERT INTO users (username,email,password,email_verified) VALUES (?,?,?,1)', args:[username,email,password] }),
  getUserByUsername: (username) => db.execute({ sql:'SELECT * FROM users WHERE username=?', args:[username] }).then(first),
  updateUserPasswordByEmail: (email, passwordHash) => db.execute({ sql:'UPDATE users SET password=? WHERE email=?', args:[passwordHash, email] }),
  updateProfile:    (display_name,bio,game_id,avatar,cover,id,country,favorite_song,school,certificates) => db.execute({ sql:'UPDATE users SET display_name=?,bio=?,game_id=?,avatar=?,cover=?,country=?,favorite_song=?,school=?,certificates=? WHERE id=?', args:[display_name,bio,game_id,avatar,cover,country||'',favorite_song||'',school||'',certificates||'',id] }),
  updatePrivacy:        (id, isPrivate) => db.execute({ sql:'UPDATE users SET is_private=? WHERE id=?', args:[isPrivate?1:0, id] }),
  updateMessagePrivacy: (id, pref) => db.execute({ sql:'UPDATE users SET message_privacy=? WHERE id=?', args:[pref, id] }),

  // ── الأصدقاء المقربون ──
  getCloseFriends:    (userId) => db.execute({ sql:`SELECT u.id,u.username,u.display_name,u.avatar,u.verified FROM close_friends cf JOIN users u ON u.id=cf.friend_id WHERE cf.user_id=? ORDER BY cf.created_at DESC`, args:[userId] }).then(rows),
  isCloseFriend:      (userId, friendId) => db.execute({ sql:'SELECT 1 FROM close_friends WHERE user_id=? AND friend_id=?', args:[userId, friendId] }).then(first).then(r => !!r),
  addCloseFriend:     (userId, friendId) => db.execute({ sql:'INSERT OR IGNORE INTO close_friends (user_id, friend_id) VALUES (?,?)', args:[userId, friendId] }),
  removeCloseFriend:  (userId, friendId) => db.execute({ sql:'DELETE FROM close_friends WHERE user_id=? AND friend_id=?', args:[userId, friendId] }),
  updateUsername:      (id, username) => db.execute({ sql:'UPDATE users SET username=? WHERE id=?', args:[username, id] }),
  updateEmail:          (id, email)    => db.execute({ sql:'UPDATE users SET email=? WHERE id=?', args:[email, id] }),
  updateUserPassword:   (id, passwordHash) => db.execute({ sql:'UPDATE users SET password=? WHERE id=?', args:[passwordHash, id] }),
  updateBirthDate:      (id, birth_date) => db.execute({ sql:'UPDATE users SET birth_date=? WHERE id=?', args:[birth_date||'', id] }),

  // ── مصادقة ثنائية (2FA/TOTP) ──
  setTotpSecretPending: (id, secret) => db.execute({ sql:'UPDATE users SET totp_secret=?, totp_enabled=0 WHERE id=?', args:[secret, id] }),
  enableTotp:           (id, backupCodesJson) => db.execute({ sql:'UPDATE users SET totp_enabled=1, totp_backup_codes=? WHERE id=?', args:[backupCodesJson, id] }),
  disableTotp:          (id) => db.execute({ sql:"UPDATE users SET totp_enabled=0, totp_secret='', totp_backup_codes='' WHERE id=?", args:[id] }),
  updateTotpBackupCodes: (id, json) => db.execute({ sql:'UPDATE users SET totp_backup_codes=? WHERE id=?', args:[json, id] }),

  // ── الجلسات/الأجهزة ──
  createSession: (userId, jti, device, browser, os, ip, location, userAgent, username) => db.execute({
    sql:`INSERT INTO user_sessions (user_id, jti, device, browser, os, ip, location, user_agent, username, created_at, last_active) VALUES (?,?,?,?,?,?,?,?,?,datetime('now'),datetime('now'))`,
    args:[userId, jti, device||'', browser||'', os||'', ip||'', location||'', userAgent||'', username||'']
  }),
  getSessionByJti: (jti) => db.execute({ sql:'SELECT * FROM user_sessions WHERE jti=?', args:[jti] }).then(first),
  touchSession: (jti) => db.execute({ sql:"UPDATE user_sessions SET last_active=datetime('now') WHERE jti=?", args:[jti] }),
  getUserSessions: (userId) => db.execute({ sql:'SELECT * FROM user_sessions WHERE user_id=? AND revoked=0 ORDER BY last_active DESC', args:[userId] }).then(rows),
  revokeSession: (userId, sessionId) => db.execute({ sql:'UPDATE user_sessions SET revoked=1 WHERE id=? AND user_id=?', args:[sessionId, userId] }),
  revokeAllSessions: (userId, exceptJti) => db.execute({ sql:'UPDATE user_sessions SET revoked=1 WHERE user_id=? AND jti!=?', args:[userId, exceptJti||''] }),

  // ── تنبيهات الأمان ──
  logSecurityEvent: (userId, type, description, ip, device) => db.execute({
    sql:`INSERT INTO security_events (user_id, type, description, ip, device) VALUES (?,?,?,?,?)`,
    args:[userId, type, description||'', ip||'', device||'']
  }),
  getSecurityEvents: (userId, limit=30) => db.execute({ sql:'SELECT * FROM security_events WHERE user_id=? ORDER BY created_at DESC LIMIT ?', args:[userId, limit] }).then(rows),

  // ── Account Changes (تعديل يوزر نيم/بريد/كلمة مرور/حذف حساب بتأكيد كود بريد) ──
  getAccountChange: (userId, purpose) => db.execute({ sql:'SELECT * FROM account_changes WHERE user_id=? AND purpose=?', args:[userId, purpose] }).then(first),
  upsertAccountChange: (userId, purpose, payload, targetEmail, code, expiresAt) => db.execute({
    sql: `INSERT INTO account_changes (user_id,purpose,payload,target_email,code,attempts,expires_at,last_sent_at)
          VALUES (?,?,?,?,?,0,?,datetime('now'))
          ON CONFLICT(user_id,purpose) DO UPDATE SET
            payload=excluded.payload,
            target_email=excluded.target_email,
            code=excluded.code,
            attempts=0,
            expires_at=excluded.expires_at,
            last_sent_at=datetime('now')`,
    args: [userId, purpose, payload, targetEmail, code, expiresAt]
  }),
  bumpAccountChangeCode: (userId, purpose, code, expiresAt) => db.execute({
    sql: `UPDATE account_changes SET code=?, attempts=0, expires_at=?, last_sent_at=datetime('now') WHERE user_id=? AND purpose=?`,
    args: [code, expiresAt, userId, purpose]
  }),
  incrementAccountChangeAttempts: (userId, purpose) => db.execute({ sql:'UPDATE account_changes SET attempts=attempts+1 WHERE user_id=? AND purpose=?', args:[userId, purpose] }),
  deleteAccountChange: (userId, purpose) => db.execute({ sql:'DELETE FROM account_changes WHERE user_id=? AND purpose=?', args:[userId, purpose] }),
  listUsers:        () => db.execute('SELECT id,username,email,role,avatar,display_name,verified,suspended,suspend_reason,totp_enabled,created_at FROM users ORDER BY created_at DESC').then(rows),
  listPublicUsers:  () => db.execute('SELECT id,username,display_name,avatar,role,verified FROM users ORDER BY username ASC').then(rows),
  deleteUser:       (id) => db.execute({ sql:"DELETE FROM users WHERE id=? AND role!='admin'", args:[id] }),
  updateUserRole:   (role,id) => db.execute({ sql:'UPDATE users SET role=? WHERE id=?', args:[role,id] }),
  searchUsers:      (q) => db.execute({ sql:"SELECT id,username,display_name,avatar,role,verified FROM users WHERE username LIKE ? OR display_name LIKE ? LIMIT 15", args:['%'+q+'%','%'+q+'%'] }).then(rows),
  suspendUser:      (id,reason) => db.execute({ sql:"UPDATE users SET suspended=1,suspend_reason=? WHERE id=? AND role!='admin'", args:[reason||'',id] }),
  unsuspendUser:    (id) => db.execute({ sql:"UPDATE users SET suspended=0,suspend_reason='' WHERE id=?", args:[id] }),

  // ── Records ──
  listRecords: (viewerId) => db.execute({ sql: `
    SELECT r.*,
           COALESCE(u.avatar, r.user_avatar, '') as user_avatar,
           COALESCE(u.display_name, u.username, r.publisher, '') as publisher_name,
           COALESCE(u.verified, 0) as publisher_verified,
           p.username as page_username,
           CASE WHEN f.follower_id IS NOT NULL THEN 1 ELSE 0 END as is_followed_author,
           CASE WHEN sp.id IS NOT NULL THEN 1 ELSE 0 END as is_saved
    FROM records r
    LEFT JOIN users u ON (u.id = r.user_id) OR (r.user_id IS NULL AND u.username = r.publisher)
    LEFT JOIN pages p ON p.id = r.page_id
    LEFT JOIN follows f ON f.follower_id = ? AND f.followed_id = r.user_id
    LEFT JOIN saved_posts sp ON sp.record_id = r.id AND sp.user_id = ?
    WHERE (r.scheduled_at IS NULL OR r.scheduled_at = '' OR r.scheduled_at <= datetime('now'))
      AND (
        COALESCE(r.privacy,'public') = 'public'
        OR (r.privacy = 'close_friends' AND EXISTS (SELECT 1 FROM close_friends cf WHERE cf.user_id = r.user_id AND cf.friend_id = ?))
      )
      AND (
        r.user_id = ?
        OR COALESCE(u.is_private,0) = 0
        OR f.follower_id IS NOT NULL
      )
    ORDER BY r.created_at DESC
  `, args: [viewerId || 0, viewerId || 0, viewerId || 0, viewerId || 0] }).then(rows),
  getRecordById: (id) => db.execute({ sql: `
    SELECT r.*,
           COALESCE(u.avatar, r.user_avatar, '') as user_avatar,
           COALESCE(u.display_name, u.username, r.publisher, '') as publisher_name,
           COALESCE(u.verified, 0) as publisher_verified,
           p.username as page_username
    FROM records r
    LEFT JOIN users u ON (u.id = r.user_id) OR (r.user_id IS NULL AND u.username = r.publisher)
    LEFT JOIN pages p ON p.id = r.page_id
    WHERE r.id = ?
  `, args: [id] }).then(first),
  createRecord: async (user_id, publisher, user_role, user_avatar, content, image, video, isReel, videoWidth, videoHeight, pageId, privacy, scheduledAt) => {
    // video/is_reel/video_width/video_height/page_id/privacy/scheduled_at معاملات جديدة (اختيارية)
    try {
      return await db.execute({
        sql: 'INSERT INTO records (user_id,publisher,user_role,user_avatar,content,image,video,is_reel,video_width,video_height,page_id,privacy,scheduled_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
        args: [user_id, publisher, user_role, user_avatar, content, image || '', video || '', isReel ? 1 : 0, videoWidth || 0, videoHeight || 0, pageId || null, privacy || 'public', scheduledAt || null]
      });
    } catch(e) {
      // إذا فشل (مثلاً لعدم وجود أعمدة الريلز/الصفحات في الإصدارات القديمة)، نعيد المحاولة بالمخطط القديم
      console.warn('⚠️ Reel/page/privacy columns missing, falling back to older schema');
      try {
        return await db.execute({
          sql: 'INSERT INTO records (user_id,publisher,user_role,user_avatar,content,image,video) VALUES (?,?,?,?,?,?,?)',
          args: [user_id, publisher, user_role, user_avatar, content, image || '', video || '']
        });
      } catch(e2) {
        return await db.execute({
          sql: 'INSERT INTO records (publisher,content,image) VALUES (?,?,?)',
          args: [publisher, content, image || '']
        });
      }
    }
  },
  updateRecord: (id, content, image) => db.execute({
    sql: 'UPDATE records SET content=?, image=?, edited=1 WHERE id=?',
    args: [content || '', image || '', id]
  }),
  updateRecordPrivacy: (id, privacy, scheduledAt) => db.execute({
    sql: 'UPDATE records SET privacy=?, scheduled_at=? WHERE id=?',
    args: [privacy || 'public', scheduledAt || null, id]
  }),
  deleteRecord: (id) => db.execute({ sql:'DELETE FROM records WHERE id=?', args:[id] }),
  getRecord:    (id) => db.execute({ sql:'SELECT * FROM records WHERE id=?', args:[id] }).then(first),
  getUserPosts: (uid, viewerId) => (Number(viewerId) === Number(uid)
    ? db.execute({ sql:`SELECT r.*, CASE WHEN sp.id IS NOT NULL THEN 1 ELSE 0 END as is_saved
        FROM records r LEFT JOIN saved_posts sp ON sp.record_id = r.id AND sp.user_id = ?
        WHERE r.user_id=? ORDER BY COALESCE(r.pinned,0) DESC, r.created_at DESC`, args:[viewerId||0, uid] }).then(rows)
    : db.execute({ sql:`SELECT r.*, CASE WHEN sp.id IS NOT NULL THEN 1 ELSE 0 END as is_saved
        FROM records r LEFT JOIN saved_posts sp ON sp.record_id = r.id AND sp.user_id = ?
        WHERE r.user_id=?
        AND (r.scheduled_at IS NULL OR r.scheduled_at = '' OR r.scheduled_at <= datetime('now'))
        AND (
          COALESCE(r.privacy,'public') = 'public'
          OR (r.privacy = 'close_friends' AND EXISTS (SELECT 1 FROM close_friends cf WHERE cf.user_id = r.user_id AND cf.friend_id = ?))
        )
        ORDER BY COALESCE(r.pinned,0) DESC, r.created_at DESC`, args:[viewerId||0, uid, viewerId||0] }).then(rows)),

  // ── تثبيت المنشور في الملف الشخصي (منشور واحد فقط في كل مرة) ──
  pinPost: async (userId, recordId) => {
    await db.execute({ sql:"UPDATE records SET pinned=0, pinned_at='' WHERE user_id=? AND pinned=1", args:[userId] });
    await db.execute({ sql:"UPDATE records SET pinned=1, pinned_at=datetime('now') WHERE id=? AND user_id=?", args:[recordId, userId] });
  },
  unpinPost: (userId, recordId) => db.execute({ sql:"UPDATE records SET pinned=0, pinned_at='' WHERE id=? AND user_id=?", args:[recordId, userId] }),

  // ── حفظ المنشورات/الريلز ──
  isPostSaved: (userId, recordId) => db.execute({ sql:'SELECT id FROM saved_posts WHERE user_id=? AND record_id=?', args:[userId, recordId] }).then(r => !!first(r)),
  savePost:    (userId, recordId) => db.execute({ sql:'INSERT OR IGNORE INTO saved_posts (user_id, record_id) VALUES (?,?)', args:[userId, recordId] }),
  unsavePost:  (userId, recordId) => db.execute({ sql:'DELETE FROM saved_posts WHERE user_id=? AND record_id=?', args:[userId, recordId] }),
  getSavedPosts: (userId) => db.execute({ sql:`
    SELECT r.*,
           COALESCE(u.avatar, r.user_avatar, '') as user_avatar,
           COALESCE(u.display_name, u.username, r.publisher, '') as publisher_name,
           COALESCE(u.verified, 0) as publisher_verified,
           1 as is_saved,
           sp.created_at as saved_at
    FROM saved_posts sp
    JOIN records r ON r.id = sp.record_id
    LEFT JOIN users u ON (u.id = r.user_id) OR (r.user_id IS NULL AND u.username = r.publisher)
    WHERE sp.user_id = ?
    ORDER BY sp.created_at DESC
  `, args:[userId] }).then(rows),

  // ── Reels (فيديوهات عمودية) ──
  listReels: (viewerId) => db.execute({ sql: `
    SELECT r.*,
           COALESCE(u.avatar, r.user_avatar, '') as user_avatar,
           COALESCE(u.display_name, u.username, r.publisher, '') as publisher_name,
           COALESCE(u.verified, 0) as publisher_verified,
           CASE WHEN f.follower_id IS NOT NULL THEN 1 ELSE 0 END as is_followed_author,
           CASE WHEN sp.id IS NOT NULL THEN 1 ELSE 0 END as is_saved
    FROM records r
    LEFT JOIN users u ON (u.id = r.user_id) OR (r.user_id IS NULL AND u.username = r.publisher)
    LEFT JOIN follows f ON f.follower_id = ? AND f.followed_id = r.user_id
    LEFT JOIN saved_posts sp ON sp.record_id = r.id AND sp.user_id = ?
    WHERE r.video IS NOT NULL AND r.video != '' AND r.is_reel = 1
      AND COALESCE(r.privacy,'public') = 'public'
      AND (r.scheduled_at IS NULL OR r.scheduled_at = '' OR r.scheduled_at <= datetime('now'))
    ORDER BY RANDOM()
  `, args: [viewerId || 0, viewerId || 0] }).then(rows),

  // ── Reactions ──
  getAllReactions:      () => db.execute('SELECT record_id,emoji,COUNT(*) as count FROM record_reactions GROUP BY record_id,emoji').then(rows),
  getReactions:        (rid) => db.execute({ sql:'SELECT emoji,COUNT(*) as count FROM record_reactions WHERE record_id=? GROUP BY emoji', args:[rid] }).then(rows),
  getUserAllReactions: (uid) => db.execute({ sql:'SELECT record_id,emoji FROM record_reactions WHERE user_id=?', args:[uid] }).then(rows),
  getUserReaction:     (rid,uid) => db.execute({ sql:'SELECT emoji FROM record_reactions WHERE record_id=? AND user_id=?', args:[rid,uid] }).then(first),
  addReaction:         (rid,uid,emoji) => db.execute({ sql:'INSERT OR REPLACE INTO record_reactions (record_id,user_id,emoji) VALUES (?,?,?)', args:[rid,uid,emoji] }),
  removeReaction:      (rid,uid) => db.execute({ sql:'DELETE FROM record_reactions WHERE record_id=? AND user_id=?', args:[rid,uid] }),

  // ── Comments ──
  getAllComments: () => db.execute(`
    SELECT rc.*, COALESCE(u.avatar,rc.avatar,'') as avatar, COALESCE(u.display_name,rc.display_name,'') as display_name
    FROM record_comments rc LEFT JOIN users u ON u.id=rc.user_id
    ORDER BY rc.record_id ASC, rc.created_at ASC
  `).then(rows),
  getComments: (rid) => db.execute({ sql:'SELECT * FROM record_comments WHERE record_id=? ORDER BY created_at ASC', args:[rid] }).then(rows),
  addComment: async (rid,uid,username,display_name,avatar,user_role,content,parentId) => {
    try {
      return await db.execute({ sql:'INSERT INTO record_comments (record_id,user_id,username,display_name,avatar,user_role,content,parent_id) VALUES (?,?,?,?,?,?,?,?)', args:[rid,uid,username,display_name,avatar,user_role,content,parentId||null] });
    } catch(e) {
      return await db.execute({ sql:'INSERT INTO record_comments (record_id,user_id,username,content) VALUES (?,?,?,?)', args:[rid,uid,username,content] });
    }
  },
  deleteComment: (id,uid,role) => role==='admin'
    ? db.execute({ sql:'DELETE FROM record_comments WHERE id=?', args:[id] })
    : db.execute({ sql:'DELETE FROM record_comments WHERE id=? AND user_id=?', args:[id,uid] }),

  // ── Messages ──
  getConversations: (uid) => db.execute({ sql:`
    SELECT m.*,u1.avatar as from_avatar,u2.avatar as to_avatar
    FROM messages m JOIN users u1 ON u1.id=m.from_id JOIN users u2 ON u2.id=m.to_id
    WHERE m.id IN (SELECT MAX(id) FROM messages WHERE from_id=? OR to_id=? GROUP BY CASE WHEN from_id=? THEN to_id ELSE from_id END)
    ORDER BY m.created_at DESC`, args:[uid,uid,uid] }).then(rows),
  getMessages:  (uid,oid) => db.execute({ sql:'SELECT m.*,u.avatar as from_avatar FROM messages m JOIN users u ON u.id=m.from_id WHERE (from_id=? AND to_id=?) OR (from_id=? AND to_id=?) ORDER BY created_at ASC', args:[uid,oid,oid,uid] }).then(rows),
  sendMessage:  (fid,tid,fn,tn,content,image,replyTo) => db.execute({ sql:'INSERT INTO messages (from_id,to_id,from_name,to_name,content,image,reply_to) VALUES (?,?,?,?,?,?,?)', args:[fid,tid,fn,tn,content,image||'',replyTo||null] }),
  getMessage:   (id) => db.execute({ sql:'SELECT * FROM messages WHERE id=?', args:[id] }).then(first),
  updateMessage:(id,content) => db.execute({ sql:'UPDATE messages SET content=?, edited=1 WHERE id=?', args:[content,id] }),
  deleteMessage:(id) => db.execute({ sql:'DELETE FROM messages WHERE id=?', args:[id] }),
  markRead:     (fid,tid) => db.execute({ sql:"UPDATE messages SET read=1, read_at=datetime('now') WHERE from_id=? AND to_id=? AND read=0", args:[fid,tid] }),
  unreadCount:  (uid) => db.execute({ sql:'SELECT COUNT(*) as count FROM messages WHERE to_id=? AND read=0', args:[uid] }).then(first),
  deleteConversation: (uid,oid) => db.execute({ sql:'DELETE FROM messages WHERE (from_id=? AND to_id=?) OR (from_id=? AND to_id=?)', args:[uid,oid,oid,uid] }),
  getConversationMedia: (uid,oid) => db.execute({ sql:"SELECT id,from_id,image,created_at FROM messages WHERE ((from_id=? AND to_id=?) OR (from_id=? AND to_id=?)) AND image IS NOT NULL AND image!='' ORDER BY created_at DESC", args:[uid,oid,oid,uid] }).then(rows),

  // ── الكنى في المحادثات الخاصة ──
  getDmNickname:  (ownerId,targetId) => db.execute({ sql:'SELECT nickname FROM dm_nicknames WHERE owner_id=? AND target_id=?', args:[ownerId,targetId] }).then(first),
  setDmNickname:  (ownerId,targetId,nickname) => db.execute({ sql:'INSERT INTO dm_nicknames (owner_id,target_id,nickname) VALUES (?,?,?) ON CONFLICT(owner_id,target_id) DO UPDATE SET nickname=excluded.nickname', args:[ownerId,targetId,nickname||''] }),
  getDmNicknamesFor: (ownerId) => db.execute({ sql:'SELECT target_id,nickname FROM dm_nicknames WHERE owner_id=?', args:[ownerId] }).then(rows),

  // ── إعدادات مؤشر القراءة ──
  setReadReceipts: (uid,enabled) => db.execute({ sql:'UPDATE users SET read_receipts=? WHERE id=?', args:[enabled?1:0,uid] }),

  // ── مؤشر الكتابة "يكتب..." ──
  setTyping:    (chatKey,uid) => db.execute({ sql:"INSERT INTO typing_status (chat_key,user_id,updated_at) VALUES (?,?,datetime('now')) ON CONFLICT(chat_key,user_id) DO UPDATE SET updated_at=datetime('now')", args:[chatKey,uid] }),
  clearTyping:  (chatKey,uid) => db.execute({ sql:'DELETE FROM typing_status WHERE chat_key=? AND user_id=?', args:[chatKey,uid] }),
  getTypingUsers: (chatKey,excludeUid) => db.execute({ sql:"SELECT ts.user_id,u.username,u.display_name FROM typing_status ts JOIN users u ON u.id=ts.user_id WHERE ts.chat_key=? AND ts.user_id!=? AND ts.updated_at > datetime('now','-6 seconds')", args:[chatKey,excludeUid] }).then(rows),

  // ── Message Reactions ──
  getMsgReactions:    (mid) => db.execute({ sql:'SELECT emoji,COUNT(*) as count FROM message_reactions WHERE message_id=? GROUP BY emoji', args:[mid] }).then(rows),
  getUserMsgReaction: (mid,uid) => db.execute({ sql:'SELECT emoji FROM message_reactions WHERE message_id=? AND user_id=?', args:[mid,uid] }).then(first),
  addMsgReaction:     (mid,uid,emoji) => db.execute({ sql:'INSERT OR REPLACE INTO message_reactions (message_id,user_id,emoji) VALUES (?,?,?)', args:[mid,uid,emoji] }),
  removeMsgReaction:  (mid,uid) => db.execute({ sql:'DELETE FROM message_reactions WHERE message_id=? AND user_id=?', args:[mid,uid] }),

  // ── Groups ──
  createGroup:       (name,desc,avatar,theme,background,by) => db.execute({ sql:'INSERT INTO groups (name,description,avatar,theme,background,created_by) VALUES (?,?,?,?,?,?)', args:[name,desc,avatar,theme,background,by] }),
  getGroup:          (id) => db.execute({ sql:'SELECT * FROM groups WHERE id=?', args:[id] }).then(first),
  updateGroup:       (id,name,desc,avatar,theme,background) => db.execute({ sql:'UPDATE groups SET name=?,description=?,avatar=?,theme=?,background=? WHERE id=?', args:[name,desc,avatar,theme,background,id] }),
  deleteGroup:       (id) => db.execute({ sql:'DELETE FROM groups WHERE id=?', args:[id] }),
  getUserGroups:     (uid) => db.execute({ sql:'SELECT g.*,gm.role as my_role,gm.nickname FROM groups g JOIN group_members gm ON gm.group_id=g.id WHERE gm.user_id=? ORDER BY g.created_at DESC', args:[uid] }).then(rows),
  getGroupMembers:   (gid) => db.execute({ sql:'SELECT gm.*,u.username,u.display_name,u.avatar,u.verified FROM group_members gm JOIN users u ON u.id=gm.user_id WHERE gm.group_id=? ORDER BY gm.role DESC,gm.joined_at ASC', args:[gid] }).then(rows),
  addGroupMember:    (gid,uid,role) => db.execute({ sql:'INSERT OR IGNORE INTO group_members (group_id,user_id,role) VALUES (?,?,?)', args:[gid,uid,role||'member'] }),
  removeGroupMember: (gid,uid) => db.execute({ sql:'DELETE FROM group_members WHERE group_id=? AND user_id=?', args:[gid,uid] }),
  updateMemberRole:  (gid,uid,role) => db.execute({ sql:'UPDATE group_members SET role=? WHERE group_id=? AND user_id=?', args:[role,gid,uid] }),
  updateMemberNick:  (gid,uid,nick) => db.execute({ sql:'UPDATE group_members SET nickname=? WHERE group_id=? AND user_id=?', args:[nick,gid,uid] }),
  isMember:          (gid,uid) => db.execute({ sql:'SELECT role FROM group_members WHERE group_id=? AND user_id=?', args:[gid,uid] }).then(first),
  getGroupMedia:     (gid) => db.execute({ sql:"SELECT id,user_id,image,created_at,from_name FROM group_messages WHERE group_id=? AND image IS NOT NULL AND image!='' ORDER BY created_at DESC", args:[gid] }).then(rows),
  markGroupRead:     (gid,uid,msgId) => db.execute({ sql:'UPDATE group_members SET last_read_message_id=? WHERE group_id=? AND user_id=? AND last_read_message_id<?', args:[msgId,gid,uid,msgId] }),

  // ── Group Messages ──
  getGroupMessages:       (gid) => db.execute({ sql:'SELECT * FROM group_messages WHERE group_id=? ORDER BY created_at ASC', args:[gid] }).then(rows),
  sendGroupMessage:       (gid,uid,fn,fa,content,image,replyTo) => db.execute({ sql:'INSERT INTO group_messages (group_id,user_id,from_name,from_avatar,content,image,reply_to) VALUES (?,?,?,?,?,?,?)', args:[gid,uid,fn,fa,content,image||'',replyTo||null] }),
  getGroupMessage:        (id) => db.execute({ sql:'SELECT * FROM group_messages WHERE id=?', args:[id] }).then(first),
  updateGroupMessage:     (id,content) => db.execute({ sql:'UPDATE group_messages SET content=?, edited=1 WHERE id=?', args:[content,id] }),
  deleteGroupMessage:     (id) => db.execute({ sql:'DELETE FROM group_messages WHERE id=?', args:[id] }),
  getGroupMsgReactions:   (mid) => db.execute({ sql:'SELECT emoji,COUNT(*) as count FROM group_message_reactions WHERE message_id=? GROUP BY emoji', args:[mid] }).then(rows),
  getUserGroupMsgReaction:(mid,uid) => db.execute({ sql:'SELECT emoji FROM group_message_reactions WHERE message_id=? AND user_id=?', args:[mid,uid] }).then(first),
  addGroupMsgReaction:    (mid,uid,emoji) => db.execute({ sql:'INSERT OR REPLACE INTO group_message_reactions (message_id,user_id,emoji) VALUES (?,?,?)', args:[mid,uid,emoji] }),
  removeGroupMsgReaction: (mid,uid) => db.execute({ sql:'DELETE FROM group_message_reactions WHERE message_id=? AND user_id=?', args:[mid,uid] }),

  // ── Verify ──
  requestVerify:       (uid,username) => db.execute({ sql:"INSERT OR REPLACE INTO verify_requests (user_id,username,status) VALUES (?,?,'pending')", args:[uid,username] }),
  getVerifyRequests:   () => db.execute("SELECT vr.*,u.avatar,u.display_name FROM verify_requests vr JOIN users u ON u.id=vr.user_id WHERE vr.status='pending' ORDER BY vr.created_at DESC").then(rows),
  updateVerify:        (uid,status) => db.execute({ sql:'UPDATE verify_requests SET status=? WHERE user_id=?', args:[status,uid] }),
  setVerified:         (uid,val) => db.execute({ sql:'UPDATE users SET verified=? WHERE id=?', args:[val,uid] }),
  getUserVerifyStatus: (uid) => db.execute({ sql:'SELECT status FROM verify_requests WHERE user_id=?', args:[uid] }).then(first),

  // ── Follows ──
  followUser:       (followerId, followedId) => db.execute({ sql:'INSERT OR IGNORE INTO follows (follower_id, followed_id) VALUES (?,?)', args:[followerId, followedId] }),
  unfollowUser:     (followerId, followedId) => db.execute({ sql:'DELETE FROM follows WHERE follower_id=? AND followed_id=?', args:[followerId, followedId] }),
  isFollowing:      (followerId, followedId) => db.execute({ sql:'SELECT 1 FROM follows WHERE follower_id=? AND followed_id=?', args:[followerId, followedId] }).then(first).then(r => !!r),
  countFollowers:   (userId) => db.execute({ sql:'SELECT COUNT(*) as count FROM follows WHERE followed_id=?', args:[userId] }).then(first).then(r => r ? r.count : 0),
  countFollowing:   (userId) => db.execute({ sql:'SELECT COUNT(*) as count FROM follows WHERE follower_id=?', args:[userId] }).then(first).then(r => r ? r.count : 0),
  getFollowers:     (userId) => db.execute({ sql:`
    SELECT u.id, u.username, u.display_name, u.avatar, u.verified
    FROM follows f JOIN users u ON u.id = f.follower_id
    WHERE f.followed_id = ?
    ORDER BY f.created_at DESC
  `, args:[userId] }).then(rows),
  getFollowing:     (userId) => db.execute({ sql:`
    SELECT u.id, u.username, u.display_name, u.avatar, u.verified
    FROM follows f JOIN users u ON u.id = f.followed_id
    WHERE f.follower_id = ?
    ORDER BY f.created_at DESC
  `, args:[userId] }).then(rows),

  // ── Notifications ──
  getUserIdByUsername: (username) => db.execute({ sql:'SELECT id FROM users WHERE username=?', args:[username] }).then(first).then(r => r ? r.id : null),
  listAllUserIds:      () => db.execute('SELECT id FROM users').then(rows).then(rs => rs.map(r => r.id)),
  createNotification:  (user_id, type, actor_id, actor_name, actor_avatar, record_id, comment_id, content, link) => db.execute({
    sql: 'INSERT INTO notifications (user_id,type,actor_id,actor_name,actor_avatar,record_id,comment_id,content,link) VALUES (?,?,?,?,?,?,?,?,?)',
    args: [user_id, type, actor_id||null, actor_name||'', actor_avatar||'', record_id||null, comment_id||null, content||'', link||'']
  }),
  createNotificationsBulk: async (userIds, type, actor_id, actor_name, actor_avatar, content, link) => {
    for (const uid of userIds) {
      await db.execute({
        sql: 'INSERT INTO notifications (user_id,type,actor_id,actor_name,actor_avatar,content,link) VALUES (?,?,?,?,?,?,?)',
        args: [uid, type, actor_id||null, actor_name||'', actor_avatar||'', content||'', link||'']
      });
    }
  },
  getNotifications:    (uid, limit=50) => db.execute({ sql:'SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT ?', args:[uid, limit] }).then(rows),
  getUnreadNotifCount: (uid) => db.execute({ sql:'SELECT COUNT(*) as count FROM notifications WHERE user_id=? AND read=0', args:[uid] }).then(first),
  markNotifRead:       (id,uid) => db.execute({ sql:'UPDATE notifications SET read=1 WHERE id=? AND user_id=?', args:[id,uid] }),
  markAllNotifRead:    (uid) => db.execute({ sql:'UPDATE notifications SET read=1 WHERE user_id=?', args:[uid] }),
  deleteNotification:  (id,uid) => db.execute({ sql:'DELETE FROM notifications WHERE id=? AND user_id=?', args:[id,uid] }),

  // ── Shizi AI ──
  getShiziMessages:   (uid) => db.execute({ sql:'SELECT id,role,content,created_at FROM shizi_messages WHERE user_id=? ORDER BY created_at ASC', args:[uid] }).then(rows),
  addShiziMessage:    (uid,role,content) => db.execute({ sql:'INSERT INTO shizi_messages (user_id,role,content) VALUES (?,?,?)', args:[uid,role,content] }),
  clearShiziMessages: (uid) => db.execute({ sql:'DELETE FROM shizi_messages WHERE user_id=?', args:[uid] }),
  countShiziUserMessagesLast24h: (uid) => db.execute({ sql:"SELECT COUNT(*) as cnt FROM shizi_messages WHERE user_id=? AND role='user' AND created_at >= datetime('now','-1 day')", args:[uid] }).then(first).then(r => r ? Number(r.cnt) : 0),

  // ── Blocks ──
  blockUser:      (uid, blockedId) => db.execute({ sql:'INSERT OR IGNORE INTO blocks (user_id,blocked_id) VALUES (?,?)', args:[uid, blockedId] }),
  unblockUser:    (uid, blockedId) => db.execute({ sql:'DELETE FROM blocks WHERE user_id=? AND blocked_id=?', args:[uid, blockedId] }),
  isBlocked:      (uid, blockedId) => db.execute({ sql:'SELECT 1 FROM blocks WHERE user_id=? AND blocked_id=?', args:[uid, blockedId] }).then(first).then(r => !!r),
  isBlockedEitherWay: async (a, b) => {
    const r = await db.execute({ sql:'SELECT 1 FROM blocks WHERE (user_id=? AND blocked_id=?) OR (user_id=? AND blocked_id=?)', args:[a,b,b,a] }).then(first);
    return !!r;
  },
  getBlockedUsers: (uid) => db.execute({ sql:`
    SELECT u.id, u.username, u.display_name, u.avatar
    FROM blocks b JOIN users u ON u.id = b.blocked_id
    WHERE b.user_id = ? ORDER BY b.created_at DESC
  `, args:[uid] }).then(rows),

  // ── Reports (بلاغات وطلبات دعم) ──
  createReport: (reporter_id, reporter_name, type, target_id, target_owner_id, target_owner_name, subject, reason) => db.execute({
    sql: 'INSERT INTO reports (reporter_id,reporter_name,type,target_id,target_owner_id,target_owner_name,subject,reason) VALUES (?,?,?,?,?,?,?,?)',
    args: [reporter_id||null, reporter_name||'', type||'general', target_id||null, target_owner_id||null, target_owner_name||'', subject||'', reason||'']
  }),
  getReportsByStatus: (status) => status
    ? db.execute({ sql:'SELECT * FROM reports WHERE status=? ORDER BY created_at DESC', args:[status] }).then(rows)
    : db.execute('SELECT * FROM reports ORDER BY created_at DESC').then(rows),
  getReportById:    (id) => db.execute({ sql:'SELECT * FROM reports WHERE id=?', args:[id] }).then(first),
  getReportsByUser: (uid) => db.execute({ sql:'SELECT * FROM reports WHERE reporter_id=? ORDER BY created_at DESC', args:[uid] }).then(rows),
  updateReport:     (id, status, admin_reply) => db.execute({ sql:"UPDATE reports SET status=?, admin_reply=?, updated_at=datetime('now') WHERE id=?", args:[status, admin_reply||'', id] }),
  countPendingReports: () => db.execute("SELECT COUNT(*) as count FROM reports WHERE status='pending'").then(first).then(r => r ? r.count : 0),

  // ── Pending Registrations (تأكيد البريد عبر كود) ──
  getPendingRegistrationByEmail: (email) => db.execute({ sql:'SELECT * FROM pending_registrations WHERE email=?', args:[email] }).then(first),
  upsertPendingRegistration: (email, username, password, code, expiresAt) => db.execute({
    sql: `INSERT INTO pending_registrations (email,username,password,code,attempts,expires_at,last_sent_at)
          VALUES (?,?,?,?,0,?,datetime('now'))
          ON CONFLICT(email) DO UPDATE SET
            username=excluded.username,
            password=excluded.password,
            code=excluded.code,
            attempts=0,
            expires_at=excluded.expires_at,
            last_sent_at=datetime('now')`,
    args: [email, username, password, code, expiresAt]
  }),
  bumpPendingRegistrationCode: (email, code, expiresAt) => db.execute({
    sql: `UPDATE pending_registrations SET code=?, attempts=0, expires_at=?, last_sent_at=datetime('now') WHERE email=?`,
    args: [code, expiresAt, email]
  }),
  incrementPendingRegistrationAttempts: (email) => db.execute({ sql:'UPDATE pending_registrations SET attempts=attempts+1 WHERE email=?', args:[email] }),
  deletePendingRegistration: (email) => db.execute({ sql:'DELETE FROM pending_registrations WHERE email=?', args:[email] }),

  // ── Password Resets (نسيت كلمة المرور) ──
  getPasswordResetByEmail: (email) => db.execute({ sql:'SELECT * FROM password_resets WHERE email=?', args:[email] }).then(first),
  upsertPasswordReset: (email, code, expiresAt) => db.execute({
    sql: `INSERT INTO password_resets (email,code,attempts,expires_at,last_sent_at)
          VALUES (?,?,0,?,datetime('now'))
          ON CONFLICT(email) DO UPDATE SET
            code=excluded.code,
            attempts=0,
            expires_at=excluded.expires_at,
            last_sent_at=datetime('now')`,
    args: [email, code, expiresAt]
  }),
  incrementPasswordResetAttempts: (email) => db.execute({ sql:'UPDATE password_resets SET attempts=attempts+1 WHERE email=?', args:[email] }),
  deletePasswordReset: (email) => db.execute({ sql:'DELETE FROM password_resets WHERE email=?', args:[email] }),

  // ── Stories (القصص - تختفي بعد 24 ساعة) ──
  deleteExpiredStories: () => db.execute("DELETE FROM stories WHERE expires_at <= datetime('now')"),
  createStory: (user_id, media, media_type, caption) => db.execute({
    sql: `INSERT INTO stories (user_id, media, media_type, caption, expires_at)
          VALUES (?,?,?,?, datetime('now','+24 hours'))`,
    args: [user_id, media, media_type || 'image', caption || '']
  }),
  listActiveStories: (viewerId) => db.execute({
    sql: `
      SELECT s.id, s.user_id, s.media, s.media_type, s.caption, s.created_at, s.expires_at,
             u.username, u.display_name, u.avatar, u.verified,
             CASE WHEN sv.id IS NULL THEN 0 ELSE 1 END as viewed
      FROM stories s
      JOIN users u ON u.id = s.user_id
      LEFT JOIN story_views sv ON sv.story_id = s.id AND sv.user_id = ?
      WHERE s.expires_at > datetime('now')
      ORDER BY s.user_id, s.created_at ASC
    `,
    args: [viewerId || 0]
  }).then(rows),
  getStory: (id) => db.execute({ sql:'SELECT * FROM stories WHERE id=?', args:[id] }).then(first),
  deleteStory: (id) => db.execute({ sql:'DELETE FROM stories WHERE id=?', args:[id] }),
  markStoryViewed: (story_id, user_id) => db.execute({
    sql: 'INSERT INTO story_views (story_id,user_id) VALUES (?,?) ON CONFLICT(story_id,user_id) DO NOTHING',
    args: [story_id, user_id]
  }),

  // ── Pages (صفحات/قنوات تابعة لحساب) ──
  createPage: (owner_id, username, name, avatar, bio, category) => db.execute({
    sql: 'INSERT INTO pages (owner_id, username, name, avatar, bio, category) VALUES (?,?,?,?,?,?)',
    args: [owner_id, username, name, avatar || '', bio || '', category || '']
  }),
  getPageByUsername: (username) => db.execute({ sql:'SELECT * FROM pages WHERE username=?', args:[username] }).then(first),
  getPageById:       (id)       => db.execute({ sql:'SELECT * FROM pages WHERE id=?', args:[id] }).then(first),
  getPagesByOwner:   (owner_id) => db.execute({ sql:'SELECT * FROM pages WHERE owner_id=? ORDER BY created_at DESC', args:[owner_id] }).then(rows),
  updatePage: (id, name, avatar, cover, bio, category) => db.execute({
    sql: 'UPDATE pages SET name=?, avatar=?, cover=?, bio=?, category=? WHERE id=?',
    args: [name, avatar || '', cover || '', bio || '', category || '', id]
  }),
  deletePage: (id) => db.execute({ sql:'DELETE FROM pages WHERE id=?', args:[id] }),
  getPagePosts: (page_id) => db.execute({ sql:'SELECT * FROM records WHERE page_id=? ORDER BY created_at DESC', args:[page_id] }).then(rows),
  followPage:   (page_id, user_id) => db.execute({
    sql: 'INSERT INTO page_follows (page_id,user_id) VALUES (?,?) ON CONFLICT(page_id,user_id) DO NOTHING',
    args: [page_id, user_id]
  }),
  unfollowPage: (page_id, user_id) => db.execute({ sql:'DELETE FROM page_follows WHERE page_id=? AND user_id=?', args:[page_id, user_id] }),
  isFollowingPage: (page_id, user_id) => db.execute({ sql:'SELECT id FROM page_follows WHERE page_id=? AND user_id=?', args:[page_id, user_id] }).then(first),
  getPageFollowerCount: (page_id) => db.execute({ sql:'SELECT COUNT(*) as c FROM page_follows WHERE page_id=?', args:[page_id] }).then(first).then(r => r?.c || 0),
};

module.exports = { db, q, initDB };
