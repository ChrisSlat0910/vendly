-- Tambah kolom revoked_at sebagai pengganti revoked boolean
ALTER TABLE user_tokens ADD COLUMN revoked_at TIMESTAMP;

-- Migrate data existing: kalau revoked = TRUE, set revoked_at = NOW()
UPDATE user_tokens SET revoked_at = NOW() WHERE revoked = TRUE;

-- Drop kolom lama yang tidak dipakai
ALTER TABLE user_tokens DROP COLUMN revoked;
ALTER TABLE user_tokens DROP COLUMN generation;

-- Update index active tokens — sesuaikan dengan kolom baru
DROP INDEX IF EXISTS idx_user_tokens_active;
CREATE INDEX idx_user_tokens_active ON user_tokens(user_id)
    WHERE revoked_at IS NULL;