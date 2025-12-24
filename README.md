# GitHub README Stats Generator

A minimal, professional GitHub stats card generator for clean README profiles. Built with Node.js, Express, and Satori for high-quality SVG-to-PNG rendering.

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

## 🚀 Features

- **Clean Design**: Dark theme, no emojis or animations for professional credibility
- **Core Metrics**: Public repositories, followers, following, total stars
- **Fast & Reliable**: Authenticated API calls to avoid rate limits
- **High-Quality Output**: SVG rendered to crisp PNG images
- **Easy Deployment**: Ready for Vercel, Heroku, or any Node.js hosting

## 📋 Prerequisites

- Node.js 18+
- GitHub Personal Access Token (for API authentication)

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/keshankumara/my-github-readme-stats.git
   cd my-github-readme-stats
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up GitHub Token:**
   - Create a Personal Access Token at [GitHub Settings > Tokens](https://github.com/settings/tokens)
   - Select "classic" token with `public_repo` scope
   - Copy `.env.example` to `.env` and add your token:
     ```bash
     cp .env.example .env
     ```
     Then edit `.env`:
     ```
     GITHUB_TOKEN=your_token_here
     ```
   - **Security Note:** Never commit `.env` to version control. It's already in `.gitignore`.

4. **Start the server:**
   ```bash
   npm start
   ```

5. **Test locally:**
   - Visit: `http://localhost:3000/api/stats-svg/yourusername`
   - Replace `yourusername` with any GitHub username

## 📖 Usage

### In Your GitHub Profile README

```markdown
## GitHub Stats & Activity

![GitHub Stats](https://your-deployed-url/api/stats-svg/yourusername)
```

### API Endpoints

- `GET /api/stats/:username` - Returns JSON stats data
- `GET /api/stats-svg/:username` - Returns PNG stats card

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Add `GITHUB_TOKEN` to environment variables
4. Deploy

### Heroku

1. Create Heroku app
2. Set `GITHUB_TOKEN` config var
3. Deploy via Git or Heroku CLI

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [github-readme-stats](https://github.com/anuraghazra/github-readme-stats)
- Built with [Satori](https://github.com/vercel/satori) for SVG generation