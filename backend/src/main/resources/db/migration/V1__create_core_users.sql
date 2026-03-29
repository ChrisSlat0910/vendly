CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

CREATE TABLE users (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username          VARCHAR(50) UNIQUE NOT NULL,
    email             VARCHAR(255) UNIQUE NOT NULL,
    password_hash     VARCHAR(255) NOT NULL,
    display_name      VARCHAR(100),
    bio               TEXT,
    avatar_url        VARCHAR(500),
    credit_score      INTEGER DEFAULT 100,
    credit_flag       VARCHAR(20) DEFAULT 'NONE',
    rating_average    DECIMAL(3,2) DEFAULT 0,
    rating_count      INTEGER DEFAULT 0,
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_active         BOOLEAN DEFAULT TRUE,
    login_attempts    INTEGER DEFAULT 0,
    locked_until      TIMESTAMP,
    last_active_at    TIMESTAMP,
    created_at        TIMESTAMP DEFAULT NOW(),
    updated_at        TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_verifications (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
    otp_code   VARCHAR(6) NOT NULL,
    type       VARCHAR(30) DEFAULT 'EMAIL_VERIFICATION',
    attempts   INTEGER DEFAULT 0,
    expires_at TIMESTAMP NOT NULL,
    verified   BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email    ON users(email);
CREATE INDEX idx_users_username ON users USING gin(username gin_trgm_ops);
CREATE INDEX idx_user_verifications_user ON user_verifications(user_id);