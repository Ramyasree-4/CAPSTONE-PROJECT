# Deployment Documentation

## Local Development

1. Copy `.env.example` to `.env`.
2. Start MongoDB and ensure ChromaDB persistent storage is writable.
3. Run the backend with `uvicorn app.main:app --reload` from `backend`.
4. Run the frontend with `npm run dev` from `frontend`.

## Render Backend

- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Add a persistent disk mounted to `/data/chroma`.
- Set environment variables from `.env.example`.

## Vercel Frontend

- Root directory: `frontend`
- Build command: `npm run build`
- Environment variable: `NEXT_PUBLIC_API_BASE_URL`

## Docker

Use `docker compose up --build` from the repository root for local containerized development.

