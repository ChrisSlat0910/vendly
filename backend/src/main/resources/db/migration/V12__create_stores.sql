CREATE TABLE stores (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id       UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    name           VARCHAR(100) NOT NULL,
    slug           VARCHAR(100) UNIQUE NOT NULL,
    description    TEXT,
    avatar_url     VARCHAR(500),
    banner_url     VARCHAR(500),
    is_verified    BOOLEAN DEFAULT FALSE,
    verified_by    UUID REFERENCES users(id),
    verified_at    TIMESTAMP,
    total_sales    INTEGER DEFAULT 0,
    total_rating   DECIMAL(3,2) DEFAULT 0,
    follower_count INTEGER DEFAULT 0,
    is_active      BOOLEAN DEFAULT TRUE,
    deleted_at     TIMESTAMP,
    created_at     TIMESTAMP DEFAULT NOW(),
    updated_at     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE store_policies (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id   UUID REFERENCES stores(id) ON DELETE CASCADE UNIQUE,
    returns    TEXT,
    shipping   TEXT,
    payment    TEXT,
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE store_followers (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id   UUID REFERENCES stores(id) ON DELETE CASCADE,
    user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(store_id, user_id)
);

CREATE INDEX idx_stores_owner      ON stores(owner_id);
CREATE INDEX idx_stores_slug       ON stores(slug);
CREATE INDEX idx_stores_active     ON stores(is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_store_followers   ON store_followers(store_id);
CREATE INDEX idx_store_followers_user ON store_followers(user_id);