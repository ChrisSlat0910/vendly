CREATE TABLE listings (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id        UUID REFERENCES users(id) ON DELETE CASCADE,
    community_id     UUID REFERENCES communities(id) ON DELETE SET NULL,
    title            VARCHAR(255) NOT NULL,
    description      TEXT,
    price            DECIMAL(12,2) NOT NULL,
    condition        VARCHAR(20) NOT NULL,
    status           VARCHAR(20) DEFAULT 'DRAFT',
    location         VARCHAR(255),
    allow_cod        BOOLEAN DEFAULT FALSE,
    allow_offers     BOOLEAN DEFAULT FALSE,
    view_count       INTEGER DEFAULT 0,
    bump_count       INTEGER DEFAULT 0,
    bumped_at        TIMESTAMP,
    approved_by      UUID REFERENCES users(id),
    approved_at      TIMESTAMP,
    rejected_by      UUID REFERENCES users(id),
    rejected_at      TIMESTAMP,
    rejection_reason VARCHAR(255),
    expires_at       TIMESTAMP,
    created_at       TIMESTAMP DEFAULT NOW(),
    updated_at       TIMESTAMP DEFAULT NOW()
);

CREATE TABLE listing_images (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    file_id    UUID REFERENCES file_uploads(id) ON DELETE SET NULL,
    position   INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_listings_seller        ON listings(seller_id);
CREATE INDEX idx_listings_community     ON listings(community_id);
CREATE INDEX idx_listings_status        ON listings(status);
CREATE INDEX idx_listings_price         ON listings(price) WHERE status = 'ACTIVE';
CREATE INDEX idx_listings_search        ON listings USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));
CREATE INDEX idx_listing_images_order   ON listing_images(listing_id, position);
CREATE INDEX idx_listing_images_primary ON listing_images(listing_id) WHERE position = 0;