import express from "express";
const app = express();
export default app;

import morgan from "morgan";

import tracksRouter from "#api/tracks";
import playlistsRouter from "#api/playlists";

// Import the registration and login routes
import usersRouter from "#api/users";

// Import middleware that gets the user from a token
import getUserFromToken from "#middleware/getUserFromToken";


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Attach the user to the request if a valid token is provided
app.use(getUserFromToken);

// Register the user routes
app.use("/users", usersRouter);

app.use("/tracks", tracksRouter);
app.use("/playlists", playlistsRouter);

app.use((err, req, res, next) => {
  // A switch statement can be used instead of if statements
  // when multiple cases are handled the same way.
  switch (err.code) {
    // Invalid type
    case "22P02":
      return res.status(400).send(err.message);
    // Unique constraint violation
    case "23505":
    // Foreign key violation
    case "23503":
      return res.status(400).send(err.detail);
    default:
      next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});
