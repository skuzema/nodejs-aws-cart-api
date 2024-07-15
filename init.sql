-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data into users table
INSERT INTO users (id, username, email, password) VALUES
('11111111-1111-1111-1111-111111111111', 'user1', 'user1@example.com', 'password1'),
('22222222-2222-2222-2222-222222222222', 'user2', 'user2@example.com', 'password2'),
('33333333-3333-3333-3333-333333333333', 'user3', 'user3@example.com', 'password3'),
('44444444-4444-4444-4444-444444444444', 'user4', 'user4@example.com', 'password4');

-- Create carts table with foreign key to users table
CREATE TABLE carts (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(10) NOT NULL CHECK (status IN ('OPEN', 'ORDERED'))
);

-- Create cart_items table
CREATE TABLE cart_items (
    cart_id UUID REFERENCES carts(id),
    product_id UUID,
    count INTEGER NOT NULL,
    PRIMARY KEY (cart_id, product_id)
);

-- Insert sample data into carts table
INSERT INTO carts (id, user_id, created_at, updated_at, status) VALUES
('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', NOW(), NOW(), 'OPEN'),
('33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', NOW(), NOW(), 'ORDERED');

-- Insert sample data into cart_items table
INSERT INTO cart_items (cart_id, product_id, count) VALUES
('11111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', 2),
('11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666', 1),
('33333333-3333-3333-3333-333333333333', '77777777-7777-7777-7777-777777777777', 3);

-- Create orders table with foreign key to users and carts table
CREATE TABLE orders (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    cart_id UUID REFERENCES carts(id),
    payment JSON,
    delivery JSON,
    comments TEXT,
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'COMPLETED', 'CANCELLED')),
    total NUMERIC NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data into orders table
INSERT INTO orders (id, user_id, cart_id, payment, delivery, comments, status, total) VALUES
('88888888-8888-8888-8888-888888888888', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '{"method": "credit_card"}', '{"address": "123 Main St"}', 'First order', 'PENDING', 100.00),
('99999999-9999-9999-9999-999999999999', '44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', '{"method": "paypal"}', '{"address": "456 Elm St"}', 'Second order', 'COMPLETED', 200.00);
