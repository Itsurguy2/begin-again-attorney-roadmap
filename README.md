# Attorney Roadmap

A focused, mobile-first web app that turns a 5-minute readiness assessment into a personalized roadmap to law school.

- **Frontend:** React 19 + Vite, mobile-first responsive UI
- **Backend:** Flask 3 + SQLAlchemy 2 (SQLite locally → Postgres in production)
- **Deploy target:** Render.com (one-click via `backend/render.yaml`)

---

## Local development

### 1. Backend

```bash
cd backend
python -m venv venv
# Windows:  venv\Scripts\activate
# macOS/Linux:  source venv/bin/activate
pip install -r requirements.txt
copy .env.example .env       # (Windows)   or:  cp .env.example .env
python app.py
```

API serves at `http://localhost:5000`. SQLite DB auto-creates at `backend/attorney_roadmap.db`.

### 2. Frontend

```bash
cd frontend
npm install
copy .env.example .env.local  # (Windows)  or:  cp .env.example .env.local
npm run dev
```

App opens at `http://localhost:5173`.

---

## Deploying to Render.com

### Option A — Blueprint (recommended)

1. Push this repo to GitHub.
2. On Render: **New → Blueprint → connect this repo**.
3. Render reads `backend/render.yaml` and provisions:
   - A free Postgres database
   - The Flask web service (with `DATABASE_URL` wired automatically)
4. After deploy, open the service → **Environment** → set `FRONTEND_ORIGIN` to your deployed frontend URL (e.g. `https://attorney-roadmap.vercel.app`).

### Option B — Manual web service

- Build command: `pip install -r requirements.txt`
- Start command: `gunicorn app:app --workers 2 --threads 4 --timeout 60 --bind 0.0.0.0:$PORT`
- Root directory: `backend`
- Add a Postgres database, then add `DATABASE_URL` env var pointing at its connection string.
- Add `FRONTEND_ORIGIN` env var with your frontend URL.

### Frontend deploy

Deploy `frontend/` to Vercel, Netlify, Cloudflare Pages, or Render Static Site.
Set the env var `VITE_API_URL=https://your-backend.onrender.com`.

Build command: `npm run build` · Output directory: `dist`.

---

## API endpoints

| Method | Path                                      | Purpose                             |
|--------|-------------------------------------------|-------------------------------------|
| GET    | `/`                                       | Service info                        |
| GET    | `/api/health`                             | DB-aware health check (for Render)  |
| POST   | `/api/analyze-score`                      | Score + persist assessment          |
| GET    | `/api/roadmap?score=N`                    | Personalized roadmap payload        |
| GET    | `/api/assessments/<id>`                   | Look up a past assessment           |
| GET    | `/api/users/<name>/assessments`           | All assessments for a user          |

`POST /api/analyze-score` request body:

```json
{ "name": "Jose", "score": 312, "answers": { "1": 8, "2": 7 } }
```

---

## Architecture notes

- The backend swaps **SQLite ↔ Postgres** automatically based on `DATABASE_URL`. Schemas are auto-created on boot via `Base.metadata.create_all` — for production-grade migrations, layer Alembic on top.
- The frontend uses `localStorage` so a refresh mid-questionnaire doesn't lose progress.
- The questionnaire calls the backend on submit; the roadmap renders entirely from the backend response (with a fallback `GET /api/roadmap` if state was rehydrated without a cached result).
- Mobile-first CSS uses fluid typography (`clamp()`), `dvh` units, `env(safe-area-inset-*)` for notched devices, and ≥44 px tap targets throughout.
