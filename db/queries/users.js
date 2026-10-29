import db from "#db/client";


// Import bcrypt to hash and compare passwords
import bcrypt from "bcrypt";

// Hash the password and save the new user 
export async function createUser(username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = `
    INSERT INTO users (username, password) 
    VALUES  ($1, $2) 
    RETURNING *
  `;

  const {
    rows: [user],
  } = await db.query(sql, [username, hashedPassword]);

  return user;
}
//Get a user by their ID
export async function getUserById(id) {
  const sql = `
    SELECT *
    FROM users
    WHERE id = $1
  `;

  const {
    rows: [user],
  } = await db.query(sql, [id]);

  return user;
}
// Find the user and check their password for login
export async function getUserByUsernameAndPassword(username, password) {
  const sql = `
    SELECT *
    FROM users
    WHERE username = $1
  `;

  const {
    rows: [user],
  } = await db.query(sql, [username]);

  if (!user) return null;

// Compare the entered password with the stored hash
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return user;
}