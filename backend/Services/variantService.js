import { query, withTransaction } from "../Config/database.js";

const syncProductStock = (client, productId) =>
  client.query(
    `UPDATE products
        SET stock_quantity=COALESCE((SELECT SUM(stock_quantity) FROM product_variants WHERE product_id=$1),0)
      WHERE product_id=$1`,
    [productId]
  );

export const createVariant = async (variant) =>
  withTransaction(async (client) => {
    const { rows } = await client.query(
      `INSERT INTO product_variants(product_id,stock_quantity,price,size,color)
       VALUES($1,$2,$3,$4,$5) RETURNING *`,
      [variant.product_id, variant.stock_quantity, variant.price, variant.size, variant.color]
    );
    await syncProductStock(client, variant.product_id);
    return rows[0];
  });

export const getVariant = async () =>
  (await query("SELECT * FROM product_variants ORDER BY product_id,variant_id")).rows;

export const updateVariant = async (variantId, variant) =>
  withTransaction(async (client) => {
    const { rows: oldRows } = await client.query(
      "SELECT product_id FROM product_variants WHERE variant_id=$1 FOR UPDATE",
      [variantId]
    );
    if (!oldRows[0]) return null;

    const { rows } = await client.query(
      `UPDATE product_variants
          SET product_id=$1,stock_quantity=$2,price=$3,size=$4,color=$5
        WHERE variant_id=$6 RETURNING *`,
      [variant.product_id, variant.stock_quantity, variant.price, variant.size, variant.color, variantId]
    );
    await syncProductStock(client, oldRows[0].product_id);
    if (oldRows[0].product_id !== variant.product_id) await syncProductStock(client, variant.product_id);
    return rows[0];
  });

export const deleteVariant = async (variantId) =>
  withTransaction(async (client) => {
    const { rows } = await client.query(
      "DELETE FROM product_variants WHERE variant_id=$1 RETURNING product_id",
      [variantId]
    );
    if (!rows[0]) return false;
    await syncProductStock(client, rows[0].product_id);
    return true;
  });
