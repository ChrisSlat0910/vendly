CREATE TABLE file_uploads (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id       UUID REFERENCES users(id) ON DELETE SET NULL,
    filename      VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    mime_type     VARCHAR(100) NOT NULL,
    size_bytes    BIGINT NOT NULL,
    path          VARCHAR(500) NOT NULL,
    checksum      VARCHAR(64),
    entity_type   VARCHAR(50),
    entity_id     UUID,
    is_public     BOOLEAN DEFAULT TRUE,
    deleted_at    TIMESTAMP,
    created_at    TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_file_uploads_user   ON file_uploads(user_id);
CREATE INDEX idx_file_uploads_entity ON file_uploads(entity_type, entity_id);
CREATE INDEX idx_file_uploads_active ON file_uploads(entity_type, entity_id) WHERE deleted_at IS NULL;