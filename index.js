import express from "express";
import axios from "axios";
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import React from 'react';

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

app.get("/api/stats-svg/:username", async (req, res) => {
  try {
    const username = req.params.username;
    const userRes = await axios.get(`https://api.github.com/users/${username}`);
    const followers = userRes.data.followers;

    const fontUrl = 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2';
    const fontResponse = await axios.get(fontUrl, { responseType: 'arraybuffer' });
    const fontData = fontResponse.data;

    const svg = await satori(
      React.createElement('div', { style: { fontSize: 24, color: "#4F46E5", fontFamily: 'Inter' } }, `${username} • Followers: ${followers}`),
      { 
        width: 400, 
        height: 100,
        fonts: [{ name: 'Inter', data: fontData, weight: 400, style: 'normal' }]
      }
    );

    const resvg = new Resvg(svg);
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();
    res.setHeader('Content-Type', 'image/png');
    res.send(pngBuffer);
  } catch (err) {
    console.error('Error generating SVG/PNG:', err);
    res.status(500).json({ error: "Failed to generate image" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
