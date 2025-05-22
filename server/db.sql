CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50),
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    role VARCHAR(20) DEFAULT 'user',
    profile_pic TEXT
);

--updated users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50),
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    role VARCHAR(20) DEFAULT 'user',
    profile_pic TEXT DEFAULT 'http://localhost:3000/api/uploads/default_profile.png',
    is_verified BOOLEAN DEFAULT FALSE
);

ALTER TABLE users
ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;

--default users
INSERT INTO users (username, email, password, role, is_verified)
VALUES
('jakedox', 'helloworld123@gmail.com', 'mypass2025', 'user', TRUE),
('luna', 'luna@example.com', 'password1', 'user', TRUE),
('mike', 'mike@example.com', 'password2', 'user', FALSE),
('sara', 'sara@example.com', 'password3', 'user', TRUE),
('admin', 'admin@example.com', 'adminpass', 'admin', TRUE);


INSERT INTO users ( username, email, password, role) VALUES ('admin2', 'admin2026@gmail.com', 'admin2026', 'admin');

UPDATE users SET role = 'admin' WHERE email = 'admin2025@gmail.com'

CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    title TEXT,
    description TEXT,
    image_url TEXT DEFAULT 'http://localhost:3000/api/uploads/default_item_placeholder.png',
    tags TEXT[],
    starting_price NUMERIC,
    current_price NUMERIC,
    owner_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ends_at TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    recent_bidder VARCHAR(100),
    bidder_id INT
);

-- preset items
-- 🧑 User 1: jakedox
INSERT INTO items (title, description, tags, starting_price, current_price, owner_id, ends_at, is_verified, recent_bidder, bidder_id) VALUES
('Mechanical Keyboard', 'RGB backlit mechanical keyboard.', ARRAY['tech', 'keyboard'], 120, 160, 1, '2025-07-01 12:00:00', TRUE, 'luna', 2),
('Gaming Mouse', 'High DPI wireless gaming mouse.', ARRAY['tech', 'mouse'], 80, 95, 1, '2025-07-02 13:00:00', FALSE, NULL, NULL),
('USB-C Hub', 'Multiport USB-C adapter with HDMI and USB 3.0.', ARRAY['tech', 'accessory'], 50, 70, 1, '2025-07-03 14:00:00', TRUE, 'sara', 4);

-- 🧑‍🦱 User 2: luna
INSERT INTO items (title, description, tags, starting_price, current_price, owner_id, ends_at, is_verified, recent_bidder, bidder_id) VALUES
('Vinyl Record Collection', 'Classic rock albums in mint condition.', ARRAY['music', 'vinyl'], 200, 260, 2, '2025-07-10 17:00:00', TRUE, 'mike', 3),
('Retro Lamp', 'Vintage-style desk lamp.', ARRAY['home', 'vintage'], 45, 45, 2, '2025-07-12 19:00:00', FALSE, NULL, NULL),
('Wooden Bookshelf', 'Compact 3-tier wooden bookshelf.', ARRAY['furniture', 'wood'], 100, 125, 2, '2025-07-13 10:00:00', TRUE, NULL, NULL);

-- 🧔 User 3: mike
INSERT INTO items (title, description, tags, starting_price, current_price, owner_id, ends_at, is_verified, recent_bidder, bidder_id) VALUES
('Smart Watch', 'Fitness tracker with heart rate monitor.', ARRAY['tech', 'watch'], 150, 200, 3, '2025-07-15 18:00:00', TRUE, 'jakedox', 1),
('Ceramic Mug Set', 'Handmade mugs, set of 4.', ARRAY['kitchen', 'handmade'], 30, 30, 3, '2025-07-17 15:30:00', FALSE, NULL, NULL),
('Bluetooth Speaker', 'Portable waterproof speaker.', ARRAY['music', 'speaker'], 90, 110, 3, '2025-07-18 13:00:00', TRUE, 'sara', 4);

-- 👩‍🦰 User 4: sara
INSERT INTO items (title, description, tags, starting_price, current_price, owner_id, ends_at, is_verified, recent_bidder, bidder_id) VALUES
('Oil Painting', 'Original abstract oil painting.', ARRAY['art', 'painting'], 300, 400, 4, '2025-07-20 16:00:00', TRUE, NULL, NULL),
('Knitted Scarf', 'Warm, colorful scarf.', ARRAY['fashion', 'handmade'], 25, 30, 4, '2025-07-21 09:00:00', FALSE, NULL, NULL),
('Decor Vase', 'Ceramic decorative vase.', ARRAY['home', 'decor'], 60, 75, 4, '2025-07-22 11:00:00', TRUE, 'luna', 2);

-- 👨‍💼 User 5: admin
INSERT INTO items (title, description, tags, starting_price, current_price, owner_id, ends_at, is_verified, recent_bidder, bidder_id) VALUES
('Tablet Pro', 'High-performance 11-inch tablet.', ARRAY['tech', 'tablet'], 400, 470, 5, '2025-07-25 14:00:00', TRUE, 'mike', 3),
('Leather Office Chair', 'Ergonomic leather chair.', ARRAY['office', 'furniture'], 250, 250, 5, '2025-07-26 10:00:00', FALSE, NULL, NULL),
('Wireless Headphones', 'Noise-cancelling over-ear headphones.', ARRAY['tech', 'audio'], 180, 220, 5, '2025-07-27 17:00:00', TRUE, 'sara', 4);




--other modification
ALTER TABLE items
ALTER COLUMN image_url
SET DEFAULT 'http://localhost:3000/api/uploads/default_item_placeholder.png';

UPDATE items
SET image_url = 'http://localhost:3000/api/uploads/default_item_placeholder.png';


UPDATE items
SET 
  starting_price = starting_price * 130,
  current_price = current_price * 130
WHERE starting_price IS NOT NULL AND current_price IS NOT NULL;


ALTER TABLE items
ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;