CREATE TABLE tags (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(255),
    created_by  UUID REFERENCES users(id),
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE entity_tags (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tag_id      UUID REFERENCES tags(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL,
    entity_id   UUID NOT NULL,
    granted_by  UUID REFERENCES users(id),
    granted_at  TIMESTAMP DEFAULT NOW(),
    revoked_by  UUID REFERENCES users(id),
    revoked_at  TIMESTAMP,
    UNIQUE(tag_id, entity_type, entity_id)
);

CREATE INDEX idx_tags_name          ON tags(name);
CREATE INDEX idx_entity_tags_entity ON entity_tags(entity_type, entity_id);
CREATE INDEX idx_entity_tags_tag    ON entity_tags(tag_id);
CREATE INDEX idx_entity_tags_active ON entity_tags(entity_type, entity_id) WHERE revoked_at IS NULL;