CREATE TABLE reports (
    id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reported_by          UUID REFERENCES users(id) ON DELETE SET NULL,
    target_type          VARCHAR(20) NOT NULL,
    target_id            UUID NOT NULL,
    reason               VARCHAR(50) NOT NULL,
    description          TEXT,
    status               VARCHAR(20) DEFAULT 'PENDING',
    priority             VARCHAR(20) DEFAULT 'NORMAL',
    reviewed_by          UUID REFERENCES users(id),
    reviewed_at          TIMESTAMP,
    review_note          TEXT,
    action_taken         VARCHAR(50),
    action_taken_at      TIMESTAMP,
    reporter_notified_at TIMESTAMP,
    resolved_at          TIMESTAMP,
    created_at           TIMESTAMP DEFAULT NOW(),
    UNIQUE(reported_by, target_type, target_id)
);

CREATE INDEX idx_reports_target   ON reports(target_type, target_id);
CREATE INDEX idx_reports_status   ON reports(status) WHERE status = 'PENDING';
CREATE INDEX idx_reports_reporter ON reports(reported_by);
CREATE INDEX idx_reports_priority ON reports(priority, created_at) WHERE status = 'PENDING';