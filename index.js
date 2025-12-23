const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;

// Fetch user info from GitHub API
app.get("/api/stats/:username", async (req, res) => {
  const username = req.params.username;
  try {
    const userRes = await axios.get(`https://api.github.com/users/${username}`);
    const reposRes = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100`);

    const totalRepos = reposRes.data.length;
    const followers = userRes.data.followers;
    const following = userRes.data.following;

    // Return JSON data (later you can convert this to SVG)
    res.json({
      username,
      name: userRes.data.name,
      totalRepos,
      followers,
      following
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
