# Deployment Guide

## Overview

This guide describes how to deploy the project locally and in cloud environments. The repository includes support for Docker Compose and Render.

## Local Deployment

### Using Docker Compose

From the repository root:

```bash
docker compose up --build
```

This will start:

- `mongo`: MongoDB database
- `backend`: FastAPI service
- `frontend`: Next.js application

### Verifying Local Deployment

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`

## Cloud Deployment

### Render Backend

The backend deployment is configured through `infra/render.yaml`.

Key deployment considerations:

- `backend/runtime.txt` pins Python to version 3.13.
- Use Render secrets for all sensitive values.
- Set `NEXT_PUBLIC_API_BASE_URL` to your backend service URL.

### Backend Environment Variables

The backend requires:

- `MISTRAL_API_KEY`
- `MISTRAL_MODEL`
- `MONGO_URI`
- `SECRET_KEY`
- `NEXT_PUBLIC_API_BASE_URL`

### Frontend Deployment

The frontend is Vercel-ready and can be deployed from the `frontend` directory.

- Ensure `NEXT_PUBLIC_API_BASE_URL` is configured as a Vercel environment variable.
- Confirm the output tracing configuration in `frontend/next.config.ts`.

## Runtime Compatibility

- The backend uses Python 3.13 to avoid native dependency build issues with `tokenizers` and `PyO3`.
- `backend/runtime.txt` is included to enforce this version on Render.

## Production Hardening

- Use HTTPS for all API traffic.
- Store secrets in environment management rather than `.env` files.
- Enable authentication and role-based access controls in the deployment configuration.
- Review audit and security logs after deployment.

## Deploying with Render

1. Create a Render Web Service for the backend.
2. Connect the repository and set the build command.
3. Use `backend/runtime.txt` to lock Python.
4. Add the required environment variables in Render.

## Deploying the Frontend on Vercel

1. Link the frontend directory to Vercel.
2. Set `NEXT_PUBLIC_API_BASE_URL` to the deployed backend URL.
3. Ensure the project root contains `frontend/next.config.ts` with `outputFileTracingRoot`.

## Verification

After deployment:

- Visit the frontend URL and log in.
- Perform a sample chat query and confirm the backend returns citations.
- Check the backend service logs for startup errors.

## Notes

- If the backend build fails on Render, verify Python version and dependency compatibility.
- If the frontend cannot reach the backend, confirm the API base URL environment variable and CORS configuration.
