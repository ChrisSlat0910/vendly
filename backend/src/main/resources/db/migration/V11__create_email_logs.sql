CREATE TABLE email_logs (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
    recipient   VARCHAR(255) NOT NULL,
    subject     VARCHAR(255) NOT NULL,
    template    VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id   UUID,
    status      VARCHAR(20) DEFAULT 'PENDING',
    sent_at     TIMESTAMP,
    failed_at   TIMESTAMP,
    error       TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_email_logs_user   ON email_logs(user_id);
CREATE INDEX idx_email_logs_status ON email_logs(status) WHERE status = 'PENDING' OR status = 'FAILED';