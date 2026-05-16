# Cost Care — Healthcare Analytics Platform

**Cost Care** is a modern full-stack healthcare cost analytics SaaS. It helps teams explore insurance spending patterns through interactive dashboards, JWT-secured authentication, and a production-ready FastAPI + Next.js architecture.

![Tech Stack](https://img.shields.io/badge/Next.js-14-black) ![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Aiven-336791) ![License](https://img.shields.io/badge/License-MIT-blue)

---

## Project Overview

| Component | Description |
|-----------|-------------|
| **Frontend** | Next.js 14, Tailwind CSS, Framer Motion, Recharts — glassmorphism UI, dark mode |
| **Backend** | FastAPI, SQLAlchemy, pandas — JWT auth, analytics APIs |
| **Database** | PostgreSQL (users table) — Aiven in production |
| **Dataset** | Healthcare insurance CSV (`age`, `sex`, `bmi`, `children`, `smoker`, `region`, `charges`) |

### Key Features

- User registration & login (bcrypt + JWT)
- Analytics dashboard with 5 KPI cards and 6 charts
- CSV upload to refresh analytics
- Downloadable analytics report (CSV)
- Profile settings (phone number)
- Responsive layout, loading skeletons, toast notifications

### Repository Structure

```
code_care/
├── frontend/                 # Next.js app (deploy to Vercel)
│   ├── app/                    # Pages: login, register, dashboard, profile
│   ├── components/             # UI, auth, dashboard, charts
│   ├── lib/                    # API client, auth helpers, types
│   └── vercel.json
├── backend/                  # FastAPI app (deploy to Render)
│   ├── app/                    # Routers, services, models, security
│   ├── data/insurance.csv      # Bundled dataset (~1,338 rows)
│   ├── scripts/                # Dataset generator
│   └── render.yaml
├── .env.example                # Environment variable template
└── README.md
```

---

## Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.11+ (3.12 recommended)
- **PostgreSQL** (local, Docker, or [Aiven](https://aiven.io/))

---

## Setup Instructions (Local Development)

### 1. Clone the repository

```bash
git clone https://github.com/Sunil-s-3/code_care.git
cd code_care
```

### 2. Configure environment variables

Copy the example env file and edit values:

```bash
# Backend
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/costcare
JWT_SECRET=your-long-random-secret-here
CORS_ORIGINS=http://localhost:3000
DATASET_PATH=./data/insurance.csv
```

```bash
# Frontend
cp frontend/.env.local.example frontend/.env.local
```

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

> **Note:** Aiven connection strings use `postgresql://` — the backend auto-converts them to `postgresql+psycopg://`.

### 3. Start PostgreSQL

Create a database named `costcare` (or match your `DATABASE_URL`). Tables are created automatically on first API startup.

### 4. Run the backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
python scripts/generate_dataset.py   # only if insurance.csv is missing
uvicorn app.main:app --reload --port 8000
```

- API: http://localhost:8000  
- Swagger docs: http://localhost:8000/docs  

### 5. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 → **Register** → **Login** → **Dashboard**.

---

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/register` | No | Create account |
| `POST` | `/api/login` | No | Obtain JWT |
| `GET` | `/api/me` | Yes | Current user profile |
| `PATCH` | `/api/profile` | Yes | Update phone number |
| `GET` | `/api/dashboard-data` | Yes | Analytics JSON |
| `POST` | `/api/upload-csv` | Yes | Replace dataset (multipart) |
| `GET` | `/api/report` | Yes | Download CSV report |

---

## Deployment

### Database — Aiven PostgreSQL

1. Create a PostgreSQL service on [Aiven](https://aiven.io/).
2. Copy the **connection string** (include `?sslmode=require` if prompted).
3. Use this as `DATABASE_URL` on Render.

### Backend — Render

1. Push this repo to GitHub.
2. In [Render](https://render.com/), create a **Web Service** from the repo.
3. Settings:
   - **Root directory:** `backend`
   - **Build command:** `pip install -r requirements.txt`
   - **Start command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Environment variables:

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | Aiven PostgreSQL URL |
   | `JWT_SECRET` | Long random string |
   | `JWT_ALGORITHM` | `HS256` |
   | `ACCESS_TOKEN_EXPIRE_MINUTES` | `60` |
   | `CORS_ORIGINS` | `https://your-app.vercel.app` |
   | `DATASET_PATH` | `./data/insurance.csv` |

5. Deploy. Note your API URL, e.g. `https://cost-care-api.onrender.com`.

Alternatively, use the included [`backend/render.yaml`](backend/render.yaml) Blueprint.

### Frontend — Vercel

1. Import the GitHub repo in [Vercel](https://vercel.com/).
2. Settings:
   - **Root directory:** `frontend`
   - **Framework preset:** Next.js
3. Environment variable:

   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_API_URL` | Your Render API URL |

4. Deploy. Update Render `CORS_ORIGINS` with your Vercel URL if not already set.

---

## Security Notes

- Never commit `.env` or `.env.local` files (see `.gitignore`).
- Use a strong `JWT_SECRET` in production.
- Keep `CORS_ORIGINS` restricted to your frontend domain(s).
- CSV uploads are limited to 5MB and validated column names.

---

## GitHub Authentication (Personal Access Token)

If `git push` asks for credentials:

1. Go to **GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)**.
2. **Generate new token (classic)** with scope **`repo`**.
3. When prompted:
   - **Username:** your GitHub username  
   - **Password:** paste the token (not your GitHub password)

For HTTPS remotes on Windows, you can also use:

```bash
git config credential.helper manager
```

---

## License

MIT © Cost Care
