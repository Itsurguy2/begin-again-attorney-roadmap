# Attorney Roadmap

A small web app that asks 42 questions about your readiness for law school, scores you out of 420, and hands back a tailored plan: which schools to look at, what to do about the LSAT, and roughly how long the runway should be.

Built for working adults thinking about a JD, not for college seniors.

## Stack

- Frontend: React 19 + Vite
- Backend: Flask 3 + SQLAlchemy 2
- Database: SQLite on your laptop, Postgres in production (same code, the URL switches it)
- Deploys to Render via `backend/render.yaml`

## Project layout

```
attorney-roadmap/
├── backend/
│   ├── app.py              # Flask app, models, scoring logic, every route
│   ├── requirements.txt
│   ├── render.yaml         # Render Blueprint (web service + Postgres)
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── App.jsx         # routes between the three screens
    │   ├── api.js          # one small fetch wrapper
    │   ├── lib/roadmap.js  # mirror of the backend scoring (offline fallback)
    │   └── pages/          # welcome, questionnaire, roadmap
    ├── package.json
    └── .env.example
```

## Running it locally

### Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env       # `copy` works on Windows
python app.py
```

The API comes up on `http://localhost:5000`. A SQLite file gets created at `backend/attorney_roadmap.db` the first time it runs. No migrations to apply.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:5173`. The frontend reads `VITE_API_URL` to find the backend; if you don't set it, it defaults to `http://localhost:5000`.

## How scoring works

42 questions, each worth 1 to 10 points, capped at 420. The total drops you into one of four bands:

| Score      | Level                  | What it means                                          |
|------------|------------------------|--------------------------------------------------------|
| 360 – 420  | FAST-TRACK READY       | Move straight into LSAT prep. Aim for scholarship-tier.|
| 280 – 359  | POTENTIAL TO SUCCEED   | Solid base. Tighten study habits and savings first.    |
| 200 – 279  | NOT YET READY          | Build a foundation. About a year out.                  |
| 0 – 199    | BUILD FOUNDATION FIRST | Habits and finances before anything else.              |

The band drives the suggested timeline (9 / 12 / 18 / 24 months) and the focus message that shows on the roadmap screen. The list of recommended schools stays the same across bands; the framing changes.

Scoring lives in `backend/app.py` (`classify` and `roadmap_for`) and is mirrored in `frontend/src/lib/roadmap.js` so a user still gets a result if the API is unreachable when they submit. If you change one, change the other.

## API

| Method | Path                              | Purpose                                            |
|--------|-----------------------------------|----------------------------------------------------|
| GET    | `/`                               | Service info (name, version, which DB is in use)   |
| GET    | `/api/health`                     | DB-aware health check (Render uses this)           |
| POST   | `/api/analyze-score`              | Score, persist, return the roadmap                 |
| GET    | `/api/roadmap?score=N`            | Roadmap for a score, no persistence                |
| GET    | `/api/assessments/<id>`           | Look up a past assessment                          |
| GET    | `/api/users/<name>/assessments`   | List a user's assessments, newest first            |

Example body for `POST /api/analyze-score`:

```json
{ "name": "Jose", "score": 312, "answers": { "1": 8, "2": 7 } }
```

The response is the full roadmap payload plus an `assessment_id` you can pass back to `/api/assessments/<id>` later. The `answers` field is optional; if you send it, it gets stored as JSON next to the score.

## Deploying

### Backend on Render, via Blueprint

The simplest path:

1. Push the repo to GitHub.
2. In Render, pick **New → Blueprint** and point it at the repo.
3. Render reads `backend/render.yaml` and provisions a free Postgres database plus the web service. `DATABASE_URL` is wired up for you.
4. After it deploys, open the service's **Environment** tab and set `FRONTEND_ORIGIN` to your frontend's URL (e.g. `https://attorney-roadmap.vercel.app`). Don't leave it as `*` in production.

### Backend, manually

If you'd rather skip the Blueprint:

- Root directory: `backend`
- Build: `pip install -r requirements.txt`
- Start: `gunicorn app:app --workers 2 --threads 4 --timeout 60 --bind 0.0.0.0:$PORT`
- Add a Postgres database and set `DATABASE_URL` to its connection string.
- Set `FRONTEND_ORIGIN` to your frontend's URL.

### Frontend

The `frontend/` directory builds to static files, so anything that serves them works: Vercel, Netlify, Cloudflare Pages, Render Static Site.

- Build: `npm run build`
- Output: `dist`
- Set `VITE_API_URL` to your deployed backend (e.g. `https://attorney-roadmap.onrender.com`).

## Environment variables

### Backend

| Variable          | Required | Default                         | Notes                                                                          |
|-------------------|----------|---------------------------------|--------------------------------------------------------------------------------|
| `DATABASE_URL`    | no       | `sqlite:///attorney_roadmap.db` | Postgres URL in production. `postgres://` schemes are rewritten automatically. |
| `FRONTEND_ORIGIN` | prod     | `*`                             | CORS allowlist. Comma-separated for more than one origin.                      |
| `SECRET_KEY`      | prod     | `dev-secret-change-me`          | Flask session secret. Render's Blueprint generates one for you.                |
| `PORT`            | no       | `5000`                          | Render injects its own.                                                        |
| `FLASK_DEBUG`     | no       | unset                           | Set to `1` for the local debugger.                                             |

### Frontend

| Variable        | Required | Default                  | Notes                                                            |
|-----------------|----------|--------------------------|------------------------------------------------------------------|
| `VITE_API_URL`  | yes      | `http://localhost:5000`  | Where the frontend looks for the API. Baked in at build time.    |

## Architecture notes

A few things worth knowing if you're reading the code:

- The backend normalizes Postgres URLs at boot. Render and Heroku still hand out the legacy `postgres://` scheme, which SQLAlchemy 2.x rejects, so we rewrite it to `postgresql+psycopg://`. That also forces the psycopg v3 driver, which means pip doesn't need to compile `psycopg2-binary`.
- Tables are created via `Base.metadata.create_all` on startup. That's fine while the schema is two tables, but if it starts moving you'll want Alembic on top.
- The frontend persists progress to `localStorage` under `attorney_roadmap_state_v1`, so a mid-questionnaire refresh doesn't wipe answers. Only completed sessions are rehydrated; a half-finished session intentionally restarts at Welcome.
- If the backend is unreachable on submit, the questionnaire falls back to `buildLocalRoadmap()`. The user still sees a score and roadmap, the response is marked `offline: true`, and the UI shows a small banner saying it wasn't saved to history.
- Mobile-first CSS leans on `clamp()` for fluid type, `dvh` for the viewport (so the address bar in mobile Safari doesn't cut the page off), and `env(safe-area-inset-*)` so the layout sits correctly under iPhone notches. Tap targets are ≥ 44px throughout.

## Troubleshooting

**`ModuleNotFoundError: psycopg2` on deploy.** Your `DATABASE_URL` is going through some path that bypasses the rewrite in `_normalize_database_url`. Use a `postgresql+psycopg://` URL or let the app see the raw `postgres://` from Render and rewrite it itself.

**CORS error in the browser console.** `FRONTEND_ORIGIN` on the backend doesn't match your frontend's exact origin (scheme + host + port). Case-sensitive. `https://app.example.com` and `https://www.app.example.com` are different origins.

**Frontend still hits `localhost:5000` in production.** `VITE_API_URL` wasn't set at build time. Vite inlines env vars into the bundle, so changing it after `npm run build` does nothing. Set it in your host's UI, then redeploy.

**Windows: `venv\Scripts\activate` says "running scripts is disabled".** Run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once in PowerShell, then try again.

**The questionnaire submits but no score saves.** Check `/api/health`. If it returns 503, the backend can reach Postgres but a query failed; if it returns 200 but `analyze-score` still fails, look at the response body — the route returns a JSON error with the SQLAlchemy detail.


This App was designed and deployed by Jesse Rosenthal 05/26/2026
