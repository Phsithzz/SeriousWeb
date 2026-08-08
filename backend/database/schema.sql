BEGIN;

CREATE TABLE IF NOT EXISTS users (
  user_id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  lastname VARCHAR(100) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  passwordhash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin'))
);

CREATE TABLE IF NOT EXISTS products (
  product_id BIGSERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description VARCHAR(200) NOT NULL,
  price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  image_filename VARCHAR(255) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  category_name VARCHAR(100) NOT NULL,
  detail TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS product_variants (
  variant_id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(product_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  size VARCHAR(50) NOT NULL,
  color VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS address (
  address_id BIGSERIAL PRIMARY KEY,
  house_number VARCHAR(100) NOT NULL,
  village_number VARCHAR(100) NOT NULL,
  subdistrict VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  province VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  order_id BIGSERIAL PRIMARY KEY,
  customer_email VARCHAR(254) NOT NULL REFERENCES users(email) ON UPDATE CASCADE ON DELETE RESTRICT,
  total_price NUMERIC(12,2) NOT NULL CHECK (total_price >= 0),
  status BOOLEAN NOT NULL DEFAULT true,
  address_id BIGINT NOT NULL REFERENCES address(address_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  payment_method VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS cart (
  cart_id BIGSERIAL PRIMARY KEY,
  customer_email VARCHAR(254) NOT NULL REFERENCES users(email) ON UPDATE CASCADE ON DELETE RESTRICT,
  variant_id BIGINT NOT NULL REFERENCES product_variants(variant_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  status BOOLEAN NOT NULL DEFAULT false,
  order_id BIGINT REFERENCES orders(order_id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE UNIQUE INDEX IF NOT EXISTS cart_one_active_variant_per_user
  ON cart(customer_email, variant_id)
  WHERE status = false;
CREATE INDEX IF NOT EXISTS product_variants_product_id_idx ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS products_brand_idx ON products(brand);
CREATE INDEX IF NOT EXISTS products_description_idx ON products(description);
CREATE INDEX IF NOT EXISTS cart_customer_status_idx ON cart(customer_email, status);
CREATE INDEX IF NOT EXISTS orders_customer_idx ON orders(customer_email);

COMMIT;
