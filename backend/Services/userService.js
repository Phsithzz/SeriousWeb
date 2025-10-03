import { query } from "../Config/database.js";
import bcrypt from "bcrypt";

export const checkEmail = async (email) => {
  const { rows } = await query("SELECT * FROM users WHERE email=$1", [email]);
  return rows[0] || null;
};

export const register = async (userData) => {
  const { name, lastname, email, password } = userData;

  const salt = await bcrypt.genSalt(10);
  const pwdHash = await bcrypt.hash(password, salt);
  const { rows } = await query(
    "INSERT INTO users(name,lastname,email,passwordhash,role) VALUES($1,$2,$3,$4,'user') RETURNING *",
    [name, lastname, email, pwdHash]
  );

  return rows[0];
};
