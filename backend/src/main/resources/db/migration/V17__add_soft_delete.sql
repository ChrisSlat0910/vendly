ALTER TABLE listings      ADD COLUMN deleted_at TIMESTAMP;
ALTER TABLE communities   ADD COLUMN deleted_at TIMESTAMP;
ALTER TABLE reports       ADD COLUMN deleted_at TIMESTAMP;
ALTER TABLE notifications ADD COLUMN deleted_at TIMESTAMP;

CREATE INDEX idx_listings_active    ON listings(deleted_at)    WHERE deleted_at IS NULL;
CREATE INDEX idx_communities_active ON communities(deleted_at) WHERE deleted_at IS NULL;