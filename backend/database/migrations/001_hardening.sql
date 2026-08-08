BEGIN;

-- These unique indexes validate existing data immediately. Resolve duplicates first if either fails.
CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique_idx ON users(email);
CREATE UNIQUE INDEX IF NOT EXISTS cart_one_active_variant_per_user
  ON cart(customer_email, variant_id)
  WHERE status = false;

CREATE INDEX IF NOT EXISTS product_variants_product_id_idx ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS products_brand_idx ON products(brand);
CREATE INDEX IF NOT EXISTS products_description_idx ON products(description);
CREATE INDEX IF NOT EXISTS cart_customer_status_idx ON cart(customer_email, status);
CREATE INDEX IF NOT EXISTS orders_customer_idx ON orders(customer_email);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_role_allowed') THEN
    ALTER TABLE users ADD CONSTRAINT users_role_allowed CHECK (role IN ('user', 'admin')) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_values_valid') THEN
    ALTER TABLE products ADD CONSTRAINT products_values_valid
      CHECK (price >= 0 AND stock_quantity >= 0) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'variants_values_valid') THEN
    ALTER TABLE product_variants ADD CONSTRAINT variants_values_valid
      CHECK (stock_quantity >= 0 AND price >= 0) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cart_values_valid') THEN
    ALTER TABLE cart ADD CONSTRAINT cart_values_valid
      CHECK (quantity > 0 AND price >= 0) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_total_valid') THEN
    ALTER TABLE orders ADD CONSTRAINT orders_total_valid CHECK (total_price >= 0) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cart_customer_email_fk') THEN
    ALTER TABLE cart ADD CONSTRAINT cart_customer_email_fk
      FOREIGN KEY (customer_email) REFERENCES users(email)
      ON UPDATE CASCADE ON DELETE RESTRICT NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cart_variant_id_fk') THEN
    ALTER TABLE cart ADD CONSTRAINT cart_variant_id_fk
      FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id)
      ON UPDATE CASCADE ON DELETE RESTRICT NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_customer_email_fk') THEN
    ALTER TABLE orders ADD CONSTRAINT orders_customer_email_fk
      FOREIGN KEY (customer_email) REFERENCES users(email)
      ON UPDATE CASCADE ON DELETE RESTRICT NOT VALID;
  END IF;
END $$;

COMMIT;

-- After cleaning any legacy rows reported by the queries in README.md, validate in a maintenance window:
-- ALTER TABLE users VALIDATE CONSTRAINT users_role_allowed;
-- ALTER TABLE products VALIDATE CONSTRAINT products_values_valid;
-- ALTER TABLE product_variants VALIDATE CONSTRAINT variants_values_valid;
-- ALTER TABLE cart VALIDATE CONSTRAINT cart_values_valid;
-- ALTER TABLE orders VALIDATE CONSTRAINT orders_total_valid;
-- ALTER TABLE cart VALIDATE CONSTRAINT cart_customer_email_fk;
-- ALTER TABLE cart VALIDATE CONSTRAINT cart_variant_id_fk;
-- ALTER TABLE orders VALIDATE CONSTRAINT orders_customer_email_fk;
