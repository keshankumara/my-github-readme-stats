import express from "express";
import axios from "axios";
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import React from 'react';
import fs from 'fs';

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
    const userRes = await axios.get(`https://api.github.com/users/${username}`, { timeout: 10000 });
    const reposRes = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100`, { timeout: 10000 });

    const totalRepos = reposRes.data.length;
    const followers = userRes.data.followers;
    const following = userRes.data.following;
    const publicRepos = userRes.data.public_repos;
    const totalStars = reposRes.data.reduce((sum, repo) => sum + repo.stargazers_count, 0);

    const fontData = fs.readFileSync('node_modules/@fontsource/roboto/files/roboto-latin-400-normal.woff');

    const svg = await satori(
      React.createElement('div', {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: '#0d1117',
          borderRadius: '8px',
          padding: '20px',
          color: '#c9d1d9',
          fontFamily: 'Roboto',
          fontSize: '14px',
          lineHeight: '1.6'
        }
      },
        React.createElement('div', { style: { fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' } }, `GitHub Stats for ${username}`),
        React.createElement('div', {}, `Public Repositories: ${publicRepos}`),
        React.createElement('div', {}, `Followers: ${followers}`),
        React.createElement('div', {}, `Following: ${following}`),
        React.createElement('div', {}, `Total Stars: ${totalStars}`)
      ),
      { 
        width: 350, 
        height: 160,
        fonts: [{ name: 'Roboto', data: fontData, weight: 400, style: 'normal' }]
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
