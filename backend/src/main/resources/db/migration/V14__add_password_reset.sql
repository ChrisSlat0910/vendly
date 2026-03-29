CREATE TABLE password_resets (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
    token      VARCHAR(255) NOT NULL UNIQUE,
    ip_address VARCHAR(45),
    expires_at TIMESTAMP NOT NULL,
    used_at    TIMESTAMP,
    used_ip    VARCHAR(45),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_pwd_reset_token  ON password_resets(token);
CREATE INDEX idx_pwd_reset_user   ON password_resets(user_id);
CREATE INDEX idx_pwd_reset_active ON password_resets(user_id) WHERE used_at IS NULL;