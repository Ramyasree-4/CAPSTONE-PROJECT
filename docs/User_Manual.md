# User Manual

## Purpose

This manual explains how to install, configure, run, and use the application from both developer and end-user perspectives.

## Prerequisites

- Node.js 20+ and npm
- Python 3.13
- Docker and Docker Compose (for local containerized deployment)
- MongoDB instance or connection string
- Mistral API key

## Local Setup

1. Clone the repository.
2. Copy `.env.example` to `.env` and populate required values.
3. Install backend dependencies:
   - `cd backend`
   - `python -m pip install -r requirements.txt`
4. Install frontend dependencies:
   - `cd ../frontend`
   - `npm install`

## Configuration

Required environment variables are documented in `.env.example`.

- `MISTRAL_API_KEY`: API key for the Mistral model.
- `MISTRAL_MODEL`: Example value: `mistral-large-latest`.
- `MONGO_URI`: Connection string for MongoDB.
- `NEXT_PUBLIC_API_BASE_URL`: Base URL for frontend API calls.
- `SECRET_KEY`: Secret key for backend sessions and security.

## Running Locally

### Backend

From `backend`:

```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Frontend

From `frontend`:

```bash
npm run dev
```

### Docker Compose

From the repo root:

```bash
docker compose up --build
```

This starts MongoDB, the backend, and the frontend together.

## Application Workflow

### Authentication

- Register a new user or sign in with existing credentials.
- Access protected pages if authenticated.

### Document Management

- Upload documents in the documents area.
- Documents are chunked and stored for semantic search.
- Admin users can review and manage documents.

### Conversational Search

- Use the chat page to ask natural language questions.
- The backend retrieves the most relevant document chunks.
- Mistral generates an answer grounded in those chunks.
- Citations are displayed to show source evidence.

### Feedback and Evaluation

- Users can submit feedback on generated responses.
- Feedback and evaluation pages enable quality review.

### Analytics and Admin

- Analytics panels show usage metrics, costs, and model performance.
- Audit logs record user actions and system events.
- Security logs capture prompt injection warnings.

## Troubleshooting

### Common Issues

- `Mistral` calls fail: verify `MISTRAL_API_KEY` and `MISTRAL_MODEL`.
- `MongoDB` connection errors: verify `MONGO_URI`.
- Frontend build errors: update packages and ensure `NEXT_PUBLIC_API_BASE_URL` is set.
- Backend import or runtime errors: ensure Python 3.13 and dependencies are installed.

### Deployment Tips

- Pin the backend runtime with `backend/runtime.txt` to avoid Python 3.14 compatibility issues.
- Use environment secrets instead of committing `.env`.

## Admin Notes

- Admin access is handled in the frontend admin route structure.
- Audit and security logs should be reviewed regularly for suspicious activity.
- Use the developer tools in the browser to inspect API responses when troubleshooting.
