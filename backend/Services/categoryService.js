import { query } from "../Config/database.js";

//CRUD

export const getCategory = async () => {
  const { rows } = await query("SELECT * FROM categories");
  return rows;
};

export const createCategory = async (categoryData) => {
  const { name, description } = categoryData;

  const { rows } = await query(
    "INSERT INTO categories(name,description) VALUES($1,$2) RETURNING*",
    [name, description]
  );
  return rows[0];
};

export const updateCategory = async (categoryId, categoryData) => {
  const { name, description } = categoryData;
  const { rows } = await query(
    "UPDATE categories SET name=$1,description=$2 WHERE category_id=$3 RETURNING*",
    [name, description, categoryId]
  );
  return rows[0];
};

export const deleteCategory = async (categoryId) => {
  const { rowCount } = await query("DELETE FROM categories WHERE category_id=$1", [
    categoryId,
  ]);
  return rowCount > 0;
};
