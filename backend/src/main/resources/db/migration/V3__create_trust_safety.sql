CREATE TABLE credit_score_history (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
    delta        INTEGER NOT NULL,
    reason       VARCHAR(100) NOT NULL,
    reference_id UUID,
    created_at   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE bans (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
    banned_by    UUID REFERENCES users(id),
    reason       TEXT NOT NULL,
    expires_at   TIMESTAMP,
    is_permanent BOOLEAN DEFAULT FALSE,
    lifted_by    UUID REFERENCES users(id),
    lifted_at    TIMESTAMP,
    created_at   TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_credit_history_user ON credit_score_history(user_id);
CREATE INDEX idx_bans_user           ON bans(user_id);
CREATE INDEX idx_bans_active ON bans(user_id) WHERE is_permanent = TRUE;