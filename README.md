# Skreieweydo Logworks — Website Source
Source for the Skreieweydo Logworks website. Built with SCSS, modular assets, and automated GitHub Actions deploy to server.

This repo contains the **source code** for the Skreieweydo Logworks website.  
The processed `/dist` is deployed automatically to [`skreieweydo.github.io`](https://skreieweydo.github.io) via GitHub Actions.

---

## Stack
- **HTML5 + SCSS** → modular, themed styles
- **Node + npm scripts** → compile SCSS, build into `/dist`
- **GitHub Actions** → CI/CD deploy into user site repo

---

## Commands
```bash
npm install     # install dependencies
npm run dev:css # watch & rebuild SCSS into src/css
npm run build   # compile SCSS, copy into dist/
npm run preview # preview dist locally on :5173

