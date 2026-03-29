INSERT INTO users (
    id, username, email, password_hash,
    display_name, is_email_verified, is_active, credit_score
) VALUES
(
    'a0000000-0000-0000-0000-000000000001',
    'admin',
    'admin@vendly.id',
    '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Platform Admin',
    TRUE, TRUE, 100
),
(
    'a0000000-0000-0000-0000-000000000002',
    'demo_seller',
    'seller@vendly.id',
    '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Demo Seller',
    TRUE, TRUE, 100
),
(
    'a0000000-0000-0000-0000-000000000003',
    'demo_buyer',
    'buyer@vendly.id',
    '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Demo Buyer',
    TRUE, TRUE, 100
);

INSERT INTO admin_roles (user_id, granted_by)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001'
);

INSERT INTO tags (id, name, description, created_by) VALUES
    ('b0000000-0000-0000-0000-000000000001', 'verified_seller',   'Verified seller account',     'a0000000-0000-0000-0000-000000000001'),
    ('b0000000-0000-0000-0000-000000000002', 'trusted_buyer',     'Trusted buyer account',       'a0000000-0000-0000-0000-000000000001'),
    ('b0000000-0000-0000-0000-000000000003', 'featured_listing',  'Featured on homepage',        'a0000000-0000-0000-0000-000000000001'),
    ('b0000000-0000-0000-0000-000000000004', 'restricted',        'Restricted from marketplace', 'a0000000-0000-0000-0000-000000000001'),
    ('b0000000-0000-0000-0000-000000000005', 'premium_community', 'Premium community access',    'a0000000-0000-0000-0000-000000000001');

INSERT INTO stores (
    id, owner_id, name, slug, description,
    is_verified, verified_by, verified_at, is_active
) VALUES (
    'c0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000002',
    'Demo Store',
    'demo-store',
    'A demo store for testing and exploration.',
    TRUE,
    'a0000000-0000-0000-0000-000000000001',
    NOW(),
    TRUE
);

INSERT INTO entity_tags (tag_id, entity_type, entity_id, granted_by)
VALUES (
    'b0000000-0000-0000-0000-000000000001',
    'USER',
    'a0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000001'
);