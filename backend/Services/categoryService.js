import {query} from "../Config/database.js"

export const createClient = async (clientData) => {
  const { name, description} = clientData;

  const { rows } = await query(
    "INSERT INTO categories(name,description) VALUES($1,$2) RETURNING *",
    [name, description]
  );
  return rows[0];
};