# speen-the-wheel

A Transporte Medal prize wheel ("Ruleta de premios"): a single-page Preact app, deployed to GitHub Pages at
https://edgard-mv.github.io/speen-the-wheel/.

- Click or tap the wheel (or press Enter/Space) to spin; the result pop-up can remove the winner with **Quitar**.
- The gear button edits the options, one per line. The list lives in the URL (`?o=...&o=...`), so the link is shareable.
- Spin sounds are synthesized with Web Audio; the speaker button mutes them.

## Develop

```bash
npm install
npm run dev
```

`npm run build` type-checks and writes the static site to `dist/`. Every push to `main` deploys it through
`.github/workflows/deploy.yml` (repo Settings → Pages → Source must be "GitHub Actions").

## Assets

`src/assets/` holds web copies of the brand assets: the logo as a 1200 px WebP and four fonts as Latin-subset WOFF2
(Anton, Bebas Neue, Neuropol, Red Rocket Condensed).
