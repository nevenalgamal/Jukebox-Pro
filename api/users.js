import express from "express";
const router = express.Router();
export default router;

// Import queries for registration and login 
import {
  createUser,
  getUserByUsernameAndPassword,
} from "#db/queries/users";

// Import the function that creates a token
import { createToken } from "#utils/jwt";

// Import  middleware that chechs for required fields
import requireBody from "#middleware/requireBody";

// Register a new user and return a token
router.post(
  "/register",
  requireBody(["username", "password"]),
  async (req, res) => {
    const { username, password } = req.body;
    const user = await createUser(username, password);
    const token = createToken({ id: user.id });
    res.status(201).send(token);
  }
);
// Chech login credentials and return a token
router.post(
  "/login",
  requireBody(["username", "password"]),
  async (req, res) => {
    const { username, password } = req.body;
    const user = await getUserByUsernameAndPassword(username, password);

    if (!user)
      return res.status(401).send("Invalid username or password.");

    const token = createToken({ id: user.id });
    res.send(token);
  }
);