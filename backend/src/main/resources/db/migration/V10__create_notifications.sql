CREATE TABLE notifications (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
    type         VARCHAR(50) NOT NULL,
    title        VARCHAR(255) NOT NULL,
    body         TEXT,
    entity_type  VARCHAR(50),
    entity_id    UUID,
    is_read      BOOLEAN DEFAULT FALSE,
    read_at      TIMESTAMP,
    delivered_at TIMESTAMP,
    expires_at   TIMESTAMP,
    created_at   TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user    ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread  ON notifications(user_id) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_active  ON notifications(user_id) WHERE expires_at IS NULL OR expires_at > NOW();