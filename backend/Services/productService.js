import { query } from "../Config/database.js";

//C R U D

export const createProduct = async (productData) => {
  const {
    name,
    description,
    price,
    stock_quantity,
    image_filename,
    brand,
    category_name,
  } = productData;

  const { rows } = await query(
    "INSERT INTO products(name,description,price,stock_quantity,image_filename,brand,category_name) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING*",
    [
      name,
      description,
      price,
      stock_quantity,
      image_filename,
      brand,
      category_name,
    ]
  );

  return rows[0];
};

export const getProduct = async () => {
  const { rows } = await query("SELECT * FROM products ORDER BY brand ASC, name ASC");
  return rows;
};

export const getProductShow = async()=>{
  const {rows} = await query("SELECT * FROM products WHERE category_name='show' ORDER BY brand ASC, name ASC")
  return rows
}

export const getProductBrand = async(brand)=>{
  const {rows} = await query("SELECT * FROM products WHERE brand=$1",[brand])
  return rows
}

export const getProductId = async(productId)=>{
  const {rows:productRows} = await query("SELECT * FROM products WHERE  product_id=$1",
    [productId]
  )

  const product =productRows[0]

  const {rows:variantRows} = await query(
    "SELECT variant_id,size,color,stock_quantity,price FROM product_variants WHERE product_id = $1 ORDER BY  size ASC"
    ,[productId]
  )
  product.variants = variantRows

  return product
}

export const getProductType = async(description)=>{

  const {rows} = await query("SELECT * FROM products WHERE description=$1  ORDER BY brand ASC, name ASC",
    [description]
  )
  return rows
}

export const updateProduct = async (productId, productData) => {
  const {
    name,
    description,
    price,
    stock_quantity,
    image_filename,
    brand,
    category_name,
  } = productData;
  const { rows } = await query(
    "UPDATE products SET name=$1,description=$2,price=$3,stock_quantity=$4,image_filename=$5,brand=$6,category_name=$7 WHERE product_id=$8 RETURNING*",
    [
      name,
      description,
      price,
      stock_quantity,
      image_filename,
      brand,
      category_name,
      productId,
    ]
  );
  return rows[0];
};

export const deleteProduct = async (productId) => {
  const { rowCount } = await query("DELETE FROM products WHERE product_id=$1", [
    productId,
  ]);
  return rowCount > 0;
};

export const searchProduc = async (searchTerm) => {
  const { rows } = await query(
    "SELECT * FROM products WHERE name ILIKE $1 OR description ILIKE $1 OR brand ILIKE $1 OR category_name ILIKE $1",
    [`%${searchTerm}%`]
  );
  return rows;
};
