import { query, withTransaction } from "../Config/database.js";

export const checkCart = async (email) => {
  const { rows } = await query(
    "SELECT cart_id FROM cart WHERE customer_email=$1 AND status=false LIMIT 1",
    [email]
  );
  return rows[0] || null;
};

export const addCart = async ({ customer_email, variant_id, quantity }) =>
  withTransaction(async (client) => {
    const { rows: cartRows } = await client.query(
      "SELECT cart_id, quantity FROM cart WHERE customer_email=$1 AND variant_id=$2 AND status=false FOR UPDATE",
      [customer_email, variant_id]
    );
    let existing = cartRows[0];
    const { rows: variantRows } = await client.query(
      "SELECT variant_id, price, stock_quantity FROM product_variants WHERE variant_id=$1 FOR UPDATE",
      [variant_id]
    );
    const variant = variantRows[0];
    if (!variant) return { error: "Variant not found" };

    if (!existing) {
      const { rows } = await client.query(
        "SELECT cart_id, quantity FROM cart WHERE customer_email=$1 AND variant_id=$2 AND status=false FOR UPDATE",
        [customer_email, variant_id]
      );
      existing = rows[0];
    }

    const nextQuantity = (existing?.quantity || 0) + quantity;
    if (nextQuantity > variant.stock_quantity) {
      return { error: "Insufficient stock" };
    }

    if (existing) {
      const { rows } = await client.query(
        "UPDATE cart SET quantity=$1,price=$2 WHERE cart_id=$3 RETURNING *",
        [nextQuantity, variant.price, existing.cart_id]
      );
      return { cart: rows[0] };
    }

    const { rows } = await client.query(
      "INSERT INTO cart(customer_email,variant_id,quantity,price) VALUES($1,$2,$3,$4) RETURNING *",
      [customer_email, variant_id, quantity, variant.price]
    );
    return { cart: rows[0] };
  });

export const getCart = async (customerEmail) => {
  const { rows } = await query(
    `SELECT c.cart_id,c.quantity,c.price,p.product_id,p.name,p.description,
            p.image_filename,v.size,v.stock_quantity
       FROM cart c
       JOIN product_variants v ON c.variant_id=v.variant_id
       JOIN products p ON v.product_id=p.product_id
      WHERE c.customer_email=$1 AND c.status=false
      ORDER BY c.cart_id`,
    [customerEmail]
  );
  return rows;
};

export const getCartOrder = async (customerEmail) => {
  const { rows } = await query(
    `SELECT c.cart_id,c.quantity,c.price,p.product_id,p.name,p.description,
            p.image_filename,v.size,o.order_id,o.total_price,o.payment_method,
            a.house_number,a.village_number,a.subdistrict,a.district,a.province,a.postal_code
       FROM cart c
       JOIN product_variants v ON c.variant_id=v.variant_id
       JOIN products p ON v.product_id=p.product_id
       JOIN orders o ON c.order_id=o.order_id
       JOIN address a ON o.address_id=a.address_id
      WHERE c.customer_email=$1 AND c.status=true
      ORDER BY o.order_id DESC,c.cart_id`,
    [customerEmail]
  );
  return rows;
};

export const updateCartQuantity = async (cartId, customerEmail, newQuantity) => {
  const { rows } = await query(
    `UPDATE cart c
        SET quantity=$1
       FROM product_variants v
      WHERE c.cart_id=$2
        AND c.customer_email=$3
        AND c.status=false
        AND c.variant_id=v.variant_id
        AND $1<=v.stock_quantity
      RETURNING c.*`,
    [newQuantity, cartId, customerEmail]
  );
  return rows[0] || null;
};

export const removeOwnCart = async (cartId, customerEmail) => {
  const { rowCount } = await query(
    "DELETE FROM cart WHERE cart_id=$1 AND customer_email=$2 AND status=false",
    [cartId, customerEmail]
  );
  return rowCount > 0;
};

export const confirmCart = async (customerEmail, address, paymentMethod) =>
  withTransaction(async (client) => {
    const { rows: cartRows } = await client.query(
      `SELECT c.cart_id,c.variant_id,c.quantity,v.product_id,v.price AS unit_price,v.stock_quantity
         FROM cart c
         JOIN product_variants v ON c.variant_id=v.variant_id
        WHERE c.customer_email=$1 AND c.status=false
        ORDER BY c.variant_id,c.cart_id
        FOR UPDATE OF c,v`,
      [customerEmail]
    );
    if (cartRows.length === 0) return null;

    for (const item of cartRows) {
      if (item.quantity > item.stock_quantity) {
        const error = new Error("Insufficient stock");
        error.code = "INSUFFICIENT_STOCK";
        throw error;
      }
    }

    const { rows: addressRows } = await client.query(
      `INSERT INTO address(house_number,village_number,subdistrict,district,province,postal_code)
       VALUES($1,$2,$3,$4,$5,$6) RETURNING address_id`,
      [
        address.house_number,
        address.village_number,
        address.subdistrict,
        address.district,
        address.province,
        address.postal_code,
      ]
    );

    const { rows: totalRows } = await client.query(
      `SELECT COALESCE(SUM(c.quantity*v.price),0) AS total_price
         FROM cart c
         JOIN product_variants v ON c.variant_id=v.variant_id
        WHERE c.customer_email=$1 AND c.status=false`,
      [customerEmail]
    );
    const totalPrice = totalRows[0].total_price;
    const { rows: orderRows } = await client.query(
      `INSERT INTO orders(customer_email,total_price,status,address_id,payment_method)
       VALUES($1,$2,true,$3,$4) RETURNING *`,
      [customerEmail, totalPrice, addressRows[0].address_id, paymentMethod]
    );
    const order = orderRows[0];

    for (const item of cartRows) {
      await client.query(
        "UPDATE product_variants SET stock_quantity=stock_quantity-$1 WHERE variant_id=$2",
        [item.quantity, item.variant_id]
      );
      await client.query("UPDATE cart SET price=$1,status=true,order_id=$2 WHERE cart_id=$3", [
        item.unit_price,
        order.order_id,
        item.cart_id,
      ]);
      await client.query(
        `UPDATE products
            SET stock_quantity=COALESCE((SELECT SUM(stock_quantity) FROM product_variants WHERE product_id=$1),0)
          WHERE product_id=$1`,
        [item.product_id]
      );
    }

    return order;
  });

export const createCart = async (cartData) => {
  const { customer_email, variant_id, quantity, price } = cartData;
  const { rows } = await query(
    `INSERT INTO cart(customer_email,variant_id,quantity,price,status)
     VALUES($1,$2,$3,$4,$5) RETURNING *`,
    [customer_email, variant_id, quantity, price, false]
  );
  return rows[0];
};

export const getAllCart = async () => (await query("SELECT * FROM cart ORDER BY cart_id")).rows;

export const updateCart = async (cartId, cartData) => {
  const { customer_email, variant_id, quantity, price } = cartData;
  const { rows } = await query(
    `UPDATE cart SET customer_email=$1,variant_id=$2,quantity=$3,price=$4
      WHERE cart_id=$5 AND status=false RETURNING *`,
    [customer_email, variant_id, quantity, price, cartId]
  );
  return rows[0] || null;
};

export const removeCart = async (cartId) =>
  (await query("DELETE FROM cart WHERE cart_id=$1 AND status=false", [cartId])).rowCount > 0;
