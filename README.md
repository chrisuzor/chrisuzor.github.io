# chrisuzor.github.io

Source for Christopher Uzochukwu’s evidence site. GitHub Actions builds this Astro project and deploys the static output to GitHub Pages.

```sh
npm ci
npm test
npm run build
npm run preview
```

The site is a user GitHub Pages project. Routes stay at the domain root (`/case-studies/`, `/writing/fleetpilot-reconciliation/`, and the rest). `astro.config.mjs` sets `site` to `https://chrisuzor.github.io` and does not set a `base` path.

## Command catalog

The palette reads `src/lib/commands.js` in the browser. Answers are the strings in that file. It does not call a network and it does not use an API key.

A later adapter could serve that same `parseCommand` result from a Vercel or Cloudflare function if the catalog ever had to leave the static page. Do not add that call while the static catalog is enough.
