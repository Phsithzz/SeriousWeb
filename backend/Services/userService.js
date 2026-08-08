import { query, withTransaction } from "../Config/database.js";

import bcrypt from "bcrypt";

//เอาไว้เช็คตอนLogin
export const checkEmail = async (email) => {
  const { rows } = await query("SELECT * FROM users WHERE email=$1", [email]);
  return rows[0] || null;
};

//เอาไว้บันทึกข้อมูลลงTable
export const register = async (userData) => {
  const { name, lastname, email, password } = userData;

  const salt = await bcrypt.genSalt(10);
  const pwdHash = await bcrypt.hash(password, salt);
  const { rows } = await query(
    "INSERT INTO users(name,lastname,email,passwordhash,role) VALUES($1,$2,$3,$4,'user') RETURNING user_id,name,lastname,email,role",
    [name, lastname, email, pwdHash]
  );

  return rows[0];
};
//ใช้แสดงข้อมูลทั้งหมดของuser แต่ละคน
export const getOneUser = async(email)=>{
  const {rows} = await query(`
    SELECT name,lastname,email FROM users WHERE email=$1
    `,[email])
  return rows[0]
}
//user แก้ไขข้อมูลส่วนตัว
export const userEditInfo = async(originalEmail,userData)=>{
  const { name, lastname, email: newEmail } = userData;

  return withTransaction(async (client) => {
    const { rows } = await client.query(
      `UPDATE users SET name=$1,lastname=$2,email=$3
        WHERE email=$4
        RETURNING user_id,name,lastname,email,role`,
      [name, lastname, newEmail, originalEmail]
    );
    if (!rows[0]) return null;
    if (newEmail !== originalEmail) {
      await client.query("UPDATE cart SET customer_email=$1 WHERE customer_email=$2", [newEmail, originalEmail]);
      await client.query("UPDATE orders SET customer_email=$1 WHERE customer_email=$2", [newEmail, originalEmail]);
    }
    return rows[0];
  });

}

// อัปเดตรหัสผ่าน
export const updatePassword = async (email, currentPassword, newPassword) => {
  
  const { rows } = await query(`SELECT passwordhash FROM users WHERE email=$1`, [email]);
  if (rows.length === 0) throw new Error("User not found");

  const isMatch = await bcrypt.compare(currentPassword, rows[0].passwordhash);
  if (!isMatch) throw new Error("รหัสผ่านปัจจุบันไม่ถูกต้อง");

  
  const salt = await bcrypt.genSalt(10);
  const newHash = await bcrypt.hash(newPassword, salt);

  
  const { rows: updated } = await query(
    `UPDATE users SET passwordhash=$1 WHERE email=$2 RETURNING email`,
    [newHash, email]
  );
  return updated[0];
};
//C R U D

//Admin use

//create ใช้อันเดียวกับregister 

export const getAllUser = async()=>{
  const {rows} = await query(`
    SELECT user_id,name,lastname,email,role FROM users
    `)
    return rows
}

export const updateUser = async(userId,userData)=>{
  const { name, lastname,email,role} = userData
  return withTransaction(async (client) => {
    const { rows: currentRows } = await client.query(
      "SELECT email FROM users WHERE user_id=$1 FOR UPDATE",
      [userId]
    );
    if (!currentRows[0]) return null;
    const originalEmail = currentRows[0].email;
    const { rows } = await client.query(
      `UPDATE users SET name=$1,lastname=$2,email=$3,role=$4
        WHERE user_id=$5
        RETURNING user_id,name,lastname,email,role`,
      [name, lastname, email, role, userId]
    );
    if (email !== originalEmail) {
      await client.query("UPDATE cart SET customer_email=$1 WHERE customer_email=$2", [email, originalEmail]);
      await client.query("UPDATE orders SET customer_email=$1 WHERE customer_email=$2", [email, originalEmail]);
    }
    return rows[0];
  });
}

export const getUserById = async (userId) => {
  const { rows } = await query(
    "SELECT user_id,name,lastname,email,role FROM users WHERE user_id=$1",
    [userId]
  );
  return rows[0] || null;
};

export const removeUser = async(userId)=>{
  const {rowCount} = await query("DELETE FROM users WHERE user_id=$1",[userId])
  return rowCount >0
}
//Admin use


