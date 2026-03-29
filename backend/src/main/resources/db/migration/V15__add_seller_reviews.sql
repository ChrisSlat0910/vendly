CREATE TABLE seller_reviews (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id    UUID REFERENCES transactions(id) UNIQUE,
    seller_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    buyer_id          UUID REFERENCES users(id) ON DELETE CASCADE,
    rating            INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment           VARCHAR(500),
    seller_reply      TEXT,
    seller_replied_at TIMESTAMP,
    is_visible        BOOLEAN DEFAULT TRUE,
    needs_moderation  BOOLEAN DEFAULT FALSE,
    moderated_by      UUID REFERENCES users(id),
    moderated_at      TIMESTAMP,
    hidden_by         UUID REFERENCES users(id),
    hidden_at         TIMESTAMP,
    hidden_reason     VARCHAR(255),
    edited_at         TIMESTAMP,
    deleted_at        TIMESTAMP,
    created_at        TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reviews_seller      ON seller_reviews(seller_id) WHERE is_visible = TRUE AND deleted_at IS NULL;
CREATE INDEX idx_reviews_buyer       ON seller_reviews(buyer_id);
CREATE INDEX idx_reviews_transaction ON seller_reviews(transaction_id);
CREATE INDEX idx_reviews_moderation  ON seller_reviews(needs_moderation) WHERE needs_moderation = TRUE;