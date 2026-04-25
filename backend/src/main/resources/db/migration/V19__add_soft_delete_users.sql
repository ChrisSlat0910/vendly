ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP;
CREATE INDEX idx_users_active ON users(deleted_at) WHERE deleted_at IS NULL;