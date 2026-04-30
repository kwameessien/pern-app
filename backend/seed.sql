INSERT INTO categories (name) VALUES
  ('Electronics'),
  ('Home'),
  ('Accessories')
ON CONFLICT (name) DO NOTHING;

INSERT INTO users (name, email, password_hash, role) VALUES
  ('Admin User', 'admin@example.com', '$2b$10$4mIGLAu0tI7NOXbtxZE8HeKlyo5nqh7TRJo6Ya6KIdcI0Qw6i1nEy', 'admin'),
  ('Demo Customer', 'customer@example.com', '$2b$10$4mIGLAu0tI7NOXbtxZE8HeKlyo5nqh7TRJo6Ya6KIdcI0Qw6i1nEy', 'customer')
ON CONFLICT (email) DO NOTHING;

INSERT INTO products (category_id, name, description, image_url, price_cents, stock, is_archived)
SELECT c.id, 'Wireless Headphones', 'Noise-cancelling over-ear headphones.', 'https://via.placeholder.com/300', 12999, 25, FALSE
FROM categories c WHERE c.name = 'Electronics'
ON CONFLICT DO NOTHING;

INSERT INTO products (category_id, name, description, image_url, price_cents, stock, is_archived)
SELECT c.id, 'Desk Lamp', 'Adjustable LED lamp with warm/cool modes.', 'https://via.placeholder.com/300', 4999, 40, FALSE
FROM categories c WHERE c.name = 'Home'
ON CONFLICT DO NOTHING;

INSERT INTO products (category_id, name, description, image_url, price_cents, stock, is_archived)
SELECT c.id, 'Laptop Sleeve', 'Protective 13-inch sleeve.', 'https://via.placeholder.com/300', 2999, 60, FALSE
FROM categories c WHERE c.name = 'Accessories'
ON CONFLICT DO NOTHING;
