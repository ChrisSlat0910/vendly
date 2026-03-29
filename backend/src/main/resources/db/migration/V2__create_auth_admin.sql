CREATE TABLE user_tokens (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash    VARCHAR(255) NOT NULL UNIQUE,
    device_info   VARCHAR(255),
    ip_address    VARCHAR(45),
    generation    INTEGER DEFAULT 0,
    expires_at    TIMESTAMP NOT NULL,
    revoked       BOOLEAN DEFAULT FALSE,
    created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE admin_roles (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    granted_by UUID REFERENCES users(id),
    granted_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_tokens_user   ON user_tokens(user_id);
CREATE INDEX idx_user_tokens_hash   ON user_tokens(token_hash);
CREATE INDEX idx_user_tokens_active ON user_tokens(user_id) WHERE revoked = FALSE;