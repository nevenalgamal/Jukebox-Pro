import express from "express";
const router = express.Router();
export default router;

import { getTracks, getTrackById } from "#db/queries/tracks";

// Import middleware that requires a logged-in user
import requireUser from "#middleware/requireUser";

// Import the query that finds playlists by track and user
import { getPlaylistsByTrackIdAndUserId } from "#db/queries/playlists";
router.get("/", async (req, res) => {
  const tracks = await getTracks();
  res.send(tracks);
});

router.get("/:id", async (req, res) => {
  const track = await getTrackById(req.params.id);
  if (!track) return res.status(404).send("Track not found.");
  res.send(track);
});

// Require login and return the user's playlists containing this track
router.get("/:id/playlists", requireUser, async (req, res) => {
  const track = await getTrackById(req.params.id);
  if (!track) return res.status(404).send("Track not found.");

  const playlists = await getPlaylistsByTrackIdAndUserId(
    req.params.id,
    req.user.id
  );
  res.send(playlists);
});