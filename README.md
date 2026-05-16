# Cost Care — Healthcare Analytics Platform

**Cost Care** is a production-ready full-stack healthcare cost analytics platform. Explore insurance spending patterns through interactive dashboards, secure JWT authentication, and a modern SaaS-style UI.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Aiven-336791)](https://aiven.io/)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel%20%2B%20Render-blue)](https://github.com/Sunil-s-3/code_care)

**Repository:** https://github.com/Sunil-s-3/code_care

---

## Screenshots

> Add screenshots to `docs/screenshots/` and link them here after deployment.

| Page | Preview |
|------|---------|
| Login | _Coming soon — `docs/screenshots/login.png`_ |
| Register | _Coming soon — `docs/screenshots/register.png`_ |
| Dashboard | _Coming soon — `docs/screenshots/dashboard.png`_ |
| Analytics Charts | _Coming soon — `docs/screenshots/charts.png`_ |
| Profile | _Coming soon — `docs/screenshots/profile.png`_ |

---

## Project Overview

Cost Care helps healthcare teams visualize insurance cost drivers: age, BMI, smoking status, region, and gender. Users register, log in, and access a protected analytics dashboard backed by a real insurance dataset.

### Key Features

- User registration & login (bcrypt + JWT)
- Auto-created PostgreSQL schema with legacy migration support
- Analytics dashboard: 5 KPI cards + 6 Recharts visualizations
- CSV upload to refresh analytics data
- Downloadable analytics report (CSV)
- Profile settings (phone number update)
- Glassmorphism UI, dark mode, toasts, loading skeletons
- Mobile-responsive sidebar layout

### Repository Structure

```
code_care/
├── frontend/              # Next.js 14 → deploy to Vercel
│   ├── app/                 # login, register, dashboard, profile
│   ├── components/          # UI, auth, dashboard, charts
│   ├── lib/                 # API client, auth, types
│   └── vercel.json
├── backend/               # FastAPI → deploy to Render
│   ├── app/                 # routers, services, models, security
│   ├── data/insurance.csv   # bundled dataset (~1,338 rows)
│   ├── scripts/             # dataset generator
│   └── render.yaml
├── .env.example
└── README.md
```

---

## Tech Stack

| Layer | Technologies |
|-------|----------------|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Recharts, next-themes |
| **Backend** | FastAPI, SQLAlchemy, pandas, python-jose, passlib (bcrypt) |
| **Database** | PostgreSQL (Aiven) |
| **Auth** | JWT (Bearer), bcrypt password hashing |
| **Deployment** | Vercel (frontend), Render (backend), Aiven (database) |

---

## Prerequisites

- Node.js 18+ and npm
- Python 3.11+ (3.12 recommended)
- PostgreSQL (local, Docker, or [Aiven](https://aiven.io/))

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Sunil-s-3/code_care.git
cd code_care
```

### 2. Environment variables

**Backend** — copy and edit:

```bash
cp backend/.env.example backend/.env
```

```env
DATABASE_URL=postgresql+psycopg://user:password@host:port/db?sslmode=require
JWT_SECRET=your-long-random-secret
CORS_ORIGINS=http://localhost:3000
DATASET_PATH=./data/insurance.csv
```

**Frontend** — copy and edit:

```bash
cp frontend/.env.local.example frontend/.env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

> Aiven URLs using `postgresql://` are auto-converted to `postgresql+psycopg://` by the backend.

### 3. Run the backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

- API: http://localhost:8000  
- Docs: http://localhost:8000/docs  
- Health: http://localhost:8000/health  

Tables are created automatically on startup (`Base.metadata.create_all` + legacy column migration).

### 4. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 → Register → Login → Dashboard.

---

## API Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/register` | No | Create account |
| `POST` | `/api/login` | No | Obtain JWT token |
| `GET` | `/api/me` | Yes | Current user profile |
| `PATCH` | `/api/profile` | Yes | Update phone number |
| `GET` | `/api/dashboard-data` | Yes | Analytics JSON (stats + charts) |
| `POST` | `/api/upload-csv` | Yes | Replace dataset (multipart, max 5MB) |
| `GET` | `/api/report` | Yes | Download CSV analytics report |
| `GET` | `/health` | No | Health check |

**Register body example:**

```json
{
  "user_id": "CC001",
  "user_name": "johndoe",
  "password": "securepass",
  "email": "john@example.com",
  "phone_number": "+1234567890"
}
```

---

## Deployment

### Ready for production

| Service | Platform | Root directory |
|---------|----------|----------------|
| Frontend | [Vercel](https://vercel.com/) | `frontend` |
| Backend | [Render](https://render.com/) | `backend` |
| Database | [Aiven PostgreSQL](https://aiven.io/) | — |

### 1. Aiven PostgreSQL

1. Create a PostgreSQL service.
2. Copy the connection string (include `?sslmode=require`).
3. Use as `DATABASE_URL` on Render.

### 2. Render (Backend)

1. Connect GitHub repo: `Sunil-s-3/code_care`.
2. **Root directory:** `backend`
3. **Build command:** `pip install -r requirements.txt`
4. **Start command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. **Environment variables:**

| Variable | Example |
|----------|---------|
| `DATABASE_URL` | Aiven connection string |
| `JWT_SECRET` | Long random string |
| `CORS_ORIGINS` | `https://your-app.vercel.app` |
| `DATASET_PATH` | `./data/insurance.csv` |

Or deploy via [`backend/render.yaml`](backend/render.yaml) Blueprint.

### 3. Vercel (Frontend)

1. Import repo `Sunil-s-3/code_care`.
2. **Root directory:** `frontend`
3. **Framework:** Next.js
4. **Environment variable:**

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://your-api.onrender.com` |

5. Deploy, then update Render `CORS_ORIGINS` with your Vercel URL.

---

## Security

- Never commit `.env` or `.env.local` (see [`.gitignore`](.gitignore))
- Use a strong `JWT_SECRET` in production
- Restrict `CORS_ORIGINS` to your frontend domain(s)
- Passwords hashed with bcrypt (cost factor 12)

---

## GitHub Authentication (Personal Access Token)

If `git push` prompts for credentials:

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. **Generate new token** with **`repo`** scope
3. When prompted:
   - **Username:** your GitHub username
   - **Password:** paste the token (not your GitHub password)

```bash
git config --global credential.helper manager   # Windows credential manager
```

---

## License

MIT © Cost Care
