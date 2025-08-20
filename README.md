# Skreieweydo Logworks — Site

[![Deploy Status](https://github.com/skreieweydo/logworks-site/actions/workflows/deploy-to-user-site.yml/badge.svg)](https://github.com/skreieweydo/logworks-site/actions/workflows/deploy-to-user-site.yml)


Source for the Skreieweydo Logworks website. Built with SCSS, modular assets, and automated GitHub Actions deploy to server.
## Development

This repo contains the **source code** for the Skreieweydo Logworks website.  
Deployment is automated — only the processed `dist/` folder is published to **skreieweydo.github.io** via GitHub Actions.  
Commits to `main` are automatically built and published to:  
👉 [https://skreieweydo.github.io](https://skreieweydo.github.io)
The processed `/dist` is deployed automatically to [`skreieweydo.github.io`](https://skreieweydo.github.io) via GitHub Actions.

---
### Prerequisites
- [Node.js](https://nodejs.org/) (>= 18)
- npm (ships with Node)

## Stack
- **HTML5 + SCSS** → modular, themed styles
- **Node + npm scripts** → compile SCSS, build into `/dist`
- **GitHub Actions** → CI/CD deploy into user site repo

---

### Scripts

- **Build the site:**
  ```bash
  npm run build

	•	Preview locally:

npm run preview

Cleans any existing dist/ folder and copies source (index.html, css/) into a fresh dist/.

Serves the built site at http://localhost:5173.

	•	Clean only:

npm run clean

Removes the dist/ folder (useful before rebuilds).

Deployment
	•	Do not commit dist/ (it’s in .gitignore).
	•	On every push to main, GitHub Actions runs the build and deploys dist/ to skreieweydo.github.io.

Notes
	•	Source lives here (index.html, css/, etc.).
	•	Output (dist/) is disposable — regenerate anytime.
	•	If you see a 404 on npm run preview, make sure you’ve run npm run build first.
