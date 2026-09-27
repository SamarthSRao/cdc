# Projects

Three independent projects live at the repository root.

## cdc

Change-data-capture replay service. It reads events from a Redis stream and delivers them to target services over gRPC.

```bash
cd cdc
cp .env.example .env
make redis-start
make run
```

Metrics are served at http://localhost:9090/metrics. See `cdc/README.md` for the example target service and seed data.

## jssrooms.space

Campus rooms app: a Go API with a React frontend. Postgres runs from Compose on port 5433, which matches the API default.

```bash
cd jssrooms.space
docker compose up -d db
cd backend && go run .
```

In another terminal:

```bash
cd jssrooms.space/frontend
npm install
npm run dev
```

The API listens on port 8080. The Vite dev server prints its own URL (port 5173 by default).

## portfolioo

Personal site built with Next.js.

```bash
cd portfolioo
npm install
npm run dev
```

Open http://localhost:3000. Spotify now-playing uses `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, and `SPOTIFY_REFRESH_TOKEN` when they are set.
