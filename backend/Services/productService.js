import { query } from "../Config/database.js";

//C R U D

//Admin use
export const createProduct = async (productData) => {
  const {
    name,
    description,
    price,
    stock_quantity,
    image_filename,
    brand,
    category_name,
    detail
  } = productData;

  const { rows } = await query(
    "INSERT INTO products(name,description,price,stock_quantity,image_filename,brand,category_name,detail) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING*",
    [
      name,
      description,
      price,
      stock_quantity,
      image_filename,
      brand,
      category_name,
      detail
    ]
  );

  return rows[0];
};

export const getProductAdmin = async () => {
  const { rows } = await query("SELECT * FROM products ORDER BY product_id ASC");
  return rows;
};

export const getProductRecord = async (productId) => {
  const { rows } = await query("SELECT * FROM products WHERE product_id=$1", [productId]);
  return rows[0] || null;
};


export const updateProduct = async (productId, productData) => {
  
  const { rows: existingRows } = await query(
    "SELECT * FROM products WHERE product_id=$1",
    [productId]
  );

  if (existingRows.length === 0) return null;

  const existingProduct = existingRows[0];

  
  const name = productData.name ?? existingProduct.name;
  const description = productData.description ?? existingProduct.description;
  const price = productData.price ?? existingProduct.price;
  const stock_quantity = productData.stock_quantity ?? existingProduct.stock_quantity;
  const image_filename = productData.image_filename ?? existingProduct.image_filename;
  const brand = productData.brand ?? existingProduct.brand;
  const category_name = productData.category_name ?? existingProduct.category_name;
  const detail = productData.detail ?? existingProduct.detail;

  const { rows } = await query(
    "UPDATE products SET name=$1, description=$2, price=$3, stock_quantity=$4, image_filename=$5, brand=$6, category_name=$7, detail=$8 WHERE product_id=$9 RETURNING *",
    [name, description, price, stock_quantity, image_filename, brand, category_name, detail, productId]
  );

  return rows[0];
};

export const deleteProduct = async (productId) => {
  const { rowCount } = await query("DELETE FROM products WHERE product_id=$1", [
    productId,
  ]);
  return rowCount > 0;
};

export const searchProduct = async (searchTerm) => {
  const { rows } = await query(
    "SELECT * FROM products WHERE name ILIKE $1 OR description ILIKE $1 OR brand ILIKE $1 OR category_name ILIKE $1 ORDER BY price DESC",
    [`%${searchTerm}%`]
  );
  return rows;
};

//Admin use end

export const getProduct = async () => {
  const { rows } = await query("SELECT * FROM products ORDER BY brand ASC, name ASC");
  return rows;
};
//เอาไว้แสดงสินค้าหน้าตัวโชว์
export const getProductShow = async()=>{
  const {rows} = await query("SELECT * FROM products WHERE category_name='show' ORDER BY brand ASC, name ASC")
  return rows
}

//เอาไว้ใช้ตอนผู้ใช้กด เลือกBrand ตรงNavbar
export const getProductBrand = async(brand)=>{
  const {rows} = await query("SELECT * FROM products WHERE brand=$1",[brand])
  return rows
}

//เอาไว้ใช้เมื่อผู้ให้กดเลือก View Detail และจะแสดงหน้าของสินค้านั้นๆ 1 ชิ้น
export const getProductId = async(productId)=>{
  const {rows:productRows} = await query("SELECT * FROM products WHERE  product_id=$1",
    [productId]
  )

  const product =productRows[0]

  if (!product) return null;

  const {rows:variantRows} = await query(
    "SELECT variant_id,size,color,stock_quantity,price FROM product_variants WHERE product_id = $1 ORDER BY  size ASC"
    ,[productId]
  )
  product.variants = variantRows

  return product
}

//เอาไว้ใช้ตอนผู้ให้เลือกประเภทของรองเท้าตรง Navbar Product กับ category sidebar ด้านซ้าย
export const getProductType = async(description)=>{

  const {rows} = await query("SELECT * FROM products WHERE description=$1  ORDER BY brand ASC, name ASC",
    [description]
  )
  return rows
}





