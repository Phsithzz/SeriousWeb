import { query } from "../Config/database.js";

//C R U D

export const createVariant = async (variantData) => {
  const { product_id, stock_quantity, price, size, color } = variantData;

  const { rows } = await query(
    "INSERT INTO product_variants(product_id,stock_quantity,price,size,color) VALUES($1,$2,$3,$4,$5) RETURNING*",
    [product_id, stock_quantity, price, size, color]
  );

  return rows[0];
};

export const getVariant = async () => {
  const { rows } = await query("SELECT * FROM product_variants");
  return rows;
};

export const updateVariant = async (variantId, variantData) => {
 const { product_id, stock_quantity, price, size, color } = variantData;
  const { rows } = await query(
    "UPDATE product_variants SET product_id=$1,stock_quantity=$2,price=$3,size=$4,color=$5 WHERE variant_id=$6 RETURNING*",
    [
      product_id, stock_quantity, price, size, color,variantId
    ]
  );
  return rows[0];
};

export const deleteVariant = async (productId) => {
  const { rowCount } = await query("DELETE FROM product_variants WHERE variant_id=$1", [
    productId,
  ]);
  return rowCount > 0;
};
