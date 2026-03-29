CREATE TABLE price_requests (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    buyer_id   UUID REFERENCES users(id) ON DELETE CASCADE,
    amount     DECIMAL(12,2) NOT NULL,
    status     VARCHAR(20) DEFAULT 'PENDING',
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(listing_id, buyer_id)
);

CREATE TABLE buy_requests (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    buyer_id   UUID REFERENCES users(id) ON DELETE CASCADE,
    status     VARCHAR(20) DEFAULT 'PENDING',
    note       TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(listing_id, buyer_id)
);

CREATE TABLE transactions (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id       UUID REFERENCES listings(id),
    seller_id        UUID REFERENCES users(id),
    buyer_id         UUID REFERENCES users(id),
    amount           DECIMAL(12,2) NOT NULL,
    platform_fee     DECIMAL(12,2) DEFAULT 0,
    snapshot_title   VARCHAR(255),
    snapshot_price   DECIMAL(12,2),
    status           VARCHAR(30) DEFAULT 'AWAITING_PAYMENT',
    payment_method   VARCHAR(20) NOT NULL,
    idempotency_key  VARCHAR(255) UNIQUE,
    payment_deadline TIMESTAMP,
    buyer_confirmed  BOOLEAN DEFAULT FALSE,
    seller_confirmed BOOLEAN DEFAULT FALSE,
    meetup_location  VARCHAR(255),
    meetup_at        TIMESTAMP,
    completed_at     TIMESTAMP,
    cancelled_at     TIMESTAMP,
    cancel_reason    VARCHAR(255),
    cancelled_by     UUID REFERENCES users(id),
    refunded_at      TIMESTAMP,
    refund_reason    VARCHAR(255),
    created_at       TIMESTAMP DEFAULT NOW(),
    updated_at       TIMESTAMP DEFAULT NOW()
);

CREATE TABLE offers (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id      UUID REFERENCES listings(id) ON DELETE CASCADE,
    buyer_id        UUID REFERENCES users(id) ON DELETE CASCADE,
    parent_offer_id UUID REFERENCES offers(id),
    amount          DECIMAL(12,2) NOT NULL,
    status          VARCHAR(20) DEFAULT 'PENDING',
    counter_amount  DECIMAL(12,2),
    expires_at      TIMESTAMP NOT NULL,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE private_messages (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id   UUID REFERENCES users(id) ON DELETE SET NULL,
    receiver_id UUID REFERENCES users(id) ON DELETE SET NULL,
    listing_id  UUID REFERENCES listings(id) ON DELETE SET NULL,
    content     TEXT NOT NULL,
    is_read     BOOLEAN DEFAULT FALSE,
    read_at     TIMESTAMP,
    deleted_at  TIMESTAMP,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_transactions_seller     ON transactions(seller_id);
CREATE INDEX idx_transactions_buyer      ON transactions(buyer_id);
CREATE INDEX idx_transactions_listing    ON transactions(listing_id);
CREATE INDEX idx_transactions_status     ON transactions(status);
CREATE INDEX idx_transactions_idempotent ON transactions(idempotency_key);
CREATE INDEX idx_price_requests_listing  ON price_requests(listing_id);
CREATE INDEX idx_buy_requests_listing    ON buy_requests(listing_id);
CREATE INDEX idx_offers_listing          ON offers(listing_id);
CREATE INDEX idx_offers_chain            ON offers(parent_offer_id) WHERE parent_offer_id IS NOT NULL;
CREATE UNIQUE INDEX idx_offers_active_unique ON offers(listing_id, buyer_id) WHERE status = 'PENDING';
CREATE INDEX idx_private_messages_convo  ON private_messages(sender_id, receiver_id, listing_id) WHERE deleted_at IS NULL;