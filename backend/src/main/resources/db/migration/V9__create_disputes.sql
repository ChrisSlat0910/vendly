CREATE TABLE disputes (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id    UUID REFERENCES transactions(id),
    opened_by         UUID REFERENCES users(id),
    respondent_id     UUID REFERENCES users(id),
    reason            VARCHAR(50) NOT NULL,
    description       TEXT NOT NULL,
    severity          VARCHAR(20) DEFAULT 'LOW',
    status            VARCHAR(20) DEFAULT 'OPEN',
    outcome           VARCHAR(20),
    resolved_by       UUID REFERENCES users(id),
    resolved_at       TIMESTAMP,
    resolution_note   TEXT,
    response_deadline TIMESTAMP,
    escalated_at      TIMESTAMP,
    created_at        TIMESTAMP DEFAULT NOW(),
    updated_at        TIMESTAMP DEFAULT NOW()
);

CREATE TABLE dispute_messages (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dispute_id  UUID REFERENCES disputes(id) ON DELETE CASCADE,
    sender_id   UUID REFERENCES users(id) ON DELETE SET NULL,
    content     TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE,
    deleted_at  TIMESTAMP,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE dispute_evidences (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dispute_id  UUID REFERENCES disputes(id) ON DELETE CASCADE,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    file_id     UUID REFERENCES file_uploads(id) ON DELETE SET NULL,
    description VARCHAR(255),
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE dispute_decisions (
    id                     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dispute_id             UUID REFERENCES disputes(id) ON DELETE CASCADE UNIQUE,
    decided_by             UUID REFERENCES users(id),
    outcome                VARCHAR(20) NOT NULL,
    penalty_buyer          INTEGER DEFAULT 0,
    penalty_seller         INTEGER DEFAULT 0,
    note                   TEXT,
    buyer_acknowledged_at  TIMESTAMP,
    seller_acknowledged_at TIMESTAMP,
    decided_at             TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_disputes_transaction ON disputes(transaction_id);
CREATE INDEX idx_disputes_opened_by   ON disputes(opened_by);
CREATE INDEX idx_disputes_status      ON disputes(status) WHERE status = 'OPEN';
CREATE INDEX idx_dispute_messages     ON dispute_messages(dispute_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_dispute_evidences    ON dispute_evidences(dispute_id);