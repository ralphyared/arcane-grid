# 🔮 Arcane Grid

A daily **D&D 5e spell puzzle** in the style of Immaculate Grid / PokéGrid.

Fill a 3×3 grid where each row and column is a criterion (school, level, class, damage
type, saving throw, …). Every cell needs a spell that matches **both** — for example
_Evocation × Wizard → Fireball_. You get 9 guesses and each spell can be used only
once. A new grid unlocks daily (the same for everyone), plus unlimited practice grids.

All 319 spells come from the D&D 5e SRD 5.1.

## Quick start

```sh
npm install
npm run dev      # http://localhost:5173
```

Useful scripts: `build`, `preview`, `test`, `lint`, `format`, `typecheck`,
`fetch-spells`. See [CLAUDE.md](CLAUDE.md) for the full list and architecture notes.

## Tech

React 19 · TypeScript · Vite 8 · Tailwind v4. Entirely client-side — the daily puzzle
is generated deterministically from the UTC date, so it needs no server. Vitest covers
the game logic, most importantly that **every generated grid is solvable**.

## Deploying (it's a static site)

`npm run build` outputs `dist/`. The build uses a relative base URL, so it works at any
domain or sub-path.

- **Vercel / Netlify / Cloudflare Pages** — framework preset “Vite”; build command
  `npm run build`, output directory `dist`.
- **GitHub Pages** — enable Settings → Pages → Source: **GitHub Actions**, then run the
  included [`deploy-pages.yml`](.github/workflows/deploy-pages.yml) manually (it's
  `workflow_dispatch`-only, since this project is normally self-hosted).

### Docker / behind Nginx Proxy Manager

A multi-stage [`Dockerfile`](Dockerfile) builds the site and serves it from a tiny
nginx image (no Node at runtime).

```sh
docker compose up -d --build   # builds the image and starts the `arcane-grid` container
```

Then add a **Proxy Host** in Nginx Proxy Manager:

- **Domain Names**: your domain/subdomain
- **Scheme**: `http`
- **Forward Hostname / IP**: `arcane-grid` (the container name — requires NPM and this
  container to share a Docker network; set it in [`docker-compose.yml`](docker-compose.yml))
- **Forward Port**: `80`
- **SSL** tab: request a Let's Encrypt cert + Force SSL + HTTP/2

(Alternatively, publish a host port in `docker-compose.yml` and forward NPM to
`http://<host-ip>:8080`.) To update after code changes: `docker compose up -d --build`.

## License & attribution

Spell data: **D&D 5e SRD 5.1**, used under the OGL 1.0a / CC-BY-4.0. Not affiliated
with or endorsed by Wizards of the Coast.

App code: _add your preferred license (e.g. MIT)._
