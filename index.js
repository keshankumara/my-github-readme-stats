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
    const userRes = await axios.get(`https://api.github.com/users/${username}`);
    const reposRes = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100`);

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
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '10px',
          padding: '20px',
          color: 'white',
          fontFamily: 'Roboto',
          fontSize: '16px'
        }
      }, [
        React.createElement('div', { key: 'header', style: { fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' } }, username),
        React.createElement('div', { key: 'stats', style: { display: 'flex', gap: '20px' } }, [
          React.createElement('div', { key: 'repos', style: { textAlign: 'center' } }, [
            React.createElement('div', { key: 'icon', style: { fontSize: '30px', marginBottom: '5px' } }, '📁'),
            React.createElement('div', { key: 'label', style: { fontSize: '12px' } }, 'Repos'),
            React.createElement('div', { key: 'value', style: { fontSize: '18px', fontWeight: 'bold' } }, publicRepos)
          ]),
          React.createElement('div', { key: 'followers', style: { textAlign: 'center' } }, [
            React.createElement('div', { key: 'icon', style: { fontSize: '30px', marginBottom: '5px' } }, '👥'),
            React.createElement('div', { key: 'label', style: { fontSize: '12px' } }, 'Followers'),
            React.createElement('div', { key: 'value', style: { fontSize: '18px', fontWeight: 'bold' } }, followers)
          ]),
          React.createElement('div', { key: 'following', style: { textAlign: 'center' } }, [
            React.createElement('div', { key: 'icon', style: { fontSize: '30px', marginBottom: '5px' } }, '👤'),
            React.createElement('div', { key: 'label', style: { fontSize: '12px' } }, 'Following'),
            React.createElement('div', { key: 'value', style: { fontSize: '18px', fontWeight: 'bold' } }, following)
          ]),
          React.createElement('div', { key: 'stars', style: { textAlign: 'center' } }, [
            React.createElement('div', { key: 'icon', style: { fontSize: '30px', marginBottom: '5px' } }, '⭐'),
            React.createElement('div', { key: 'label', style: { fontSize: '12px' } }, 'Stars'),
            React.createElement('div', { key: 'value', style: { fontSize: '18px', fontWeight: 'bold' } }, totalStars)
          ])
        ])
      ]),
      { 
        width: 400, 
        height: 150,
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
