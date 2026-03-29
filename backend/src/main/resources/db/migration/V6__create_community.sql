CREATE TABLE communities (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name         VARCHAR(100) UNIQUE NOT NULL,
    slug         VARCHAR(100) UNIQUE NOT NULL,
    description  TEXT,
    avatar_url   VARCHAR(500),
    banner_url   VARCHAR(500),
    owner_id     UUID REFERENCES users(id),
    is_private   BOOLEAN DEFAULT FALSE,
    member_count INTEGER DEFAULT 0,
    created_at   TIMESTAMP DEFAULT NOW(),
    updated_at   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE community_members (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
    role         VARCHAR(20) DEFAULT 'MEMBER',
    joined_at    TIMESTAMP DEFAULT NOW(),
    UNIQUE(community_id, user_id)
);

CREATE TABLE rank_configs (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    name         VARCHAR(50) NOT NULL,
    min_score    INTEGER NOT NULL,
    max_score    INTEGER,
    badge_url    VARCHAR(500),
    created_at   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE community_profiles (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
    rank_id      UUID REFERENCES rank_configs(id),
    score        INTEGER DEFAULT 0,
    joined_at    TIMESTAMP DEFAULT NOW(),
    updated_at   TIMESTAMP DEFAULT NOW(),
    UNIQUE(community_id, user_id)
);

CREATE TABLE channels (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    name         VARCHAR(100) NOT NULL,
    description  VARCHAR(255),
    is_private   BOOLEAN DEFAULT FALSE,
    created_by   UUID REFERENCES users(id),
    created_at   TIMESTAMP DEFAULT NOW(),
    UNIQUE(community_id, name)
);

CREATE TABLE messages (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel_id   UUID REFERENCES channels(id) ON DELETE CASCADE,
    sender_id    UUID REFERENCES users(id) ON DELETE SET NULL,
    content      TEXT NOT NULL,
    is_pinned    BOOLEAN DEFAULT FALSE,
    reply_to_id  UUID REFERENCES messages(id),
    deleted_at   TIMESTAMP,
    created_at   TIMESTAMP DEFAULT NOW(),
    updated_at   TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_communities_slug        ON communities(slug);
CREATE INDEX idx_community_members_user  ON community_members(user_id);
CREATE INDEX idx_community_members_comm  ON community_members(community_id);
CREATE INDEX idx_channels_community      ON channels(community_id);
CREATE INDEX idx_messages_channel        ON messages(channel_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_community_profiles_user ON community_profiles(user_id);