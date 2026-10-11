CREATE TABLE users (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  middle_name TEXT NOT NULL DEFAULT '',
  last_name TEXT NOT NULL,
  suffix TEXT NOT NULL DEFAULT '',
  position TEXT NOT NULL,
  office TEXT NOT NULL,
  province TEXT NOT NULL DEFAULT '',
  municipality TEXT NOT NULL DEFAULT '',
  designated TEXT NOT NULL DEFAULT '',
  designation TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  username TEXT NOT NULL UNIQUE COLLATE NOCASE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  initial_password_encrypted TEXT,
  profile_photo_key TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX users_status_created ON users (status, created_at DESC);
CREATE INDEX users_province ON users (province);
CREATE TABLE sessions (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX sessions_user ON sessions (user_id);
CREATE INDEX sessions_expiry ON sessions (expires_at);