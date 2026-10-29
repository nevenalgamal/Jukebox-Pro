import db from "#db/client";

import { createPlaylist } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { createTrack } from "#db/queries/tracks";

// Import the query that creates users n   
import { createUser } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // Create two sample users
  const user1 = await createUser("neven", "password123");
  const user2 = await createUser("sara", "password456"); 
  for (let i = 1; i <= 20; i++) {

    // Alternate playlist ownership between the two users
    await createPlaylist("Playlist " + i, "lorem ipsum playlist description", i % 2 === 0 ? user2.id: user1.id);
    await createTrack("Track " + i, i * 50000);
  }

  // Add five tracks to each of the first three playlists
  for (let i = 1; i <= 15; i++) {
    const playlistId = 1 + Math.floor((i  -1) / 5);
    await createPlaylistTrack(playlistId, i);
  }
}
