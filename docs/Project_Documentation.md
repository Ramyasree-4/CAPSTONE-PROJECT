# Project Documentation

## Executive Summary

This project is a full-stack retrieval-augmented generation (RAG) platform that combines a React/Next.js frontend with a FastAPI backend, MongoDB data storage, and a Mistral LLM gateway. The application enables authenticated users to upload documents, manage knowledge sources, perform safe conversational search, and review analytics.

## Problem Statement

Knowledge workers need fast access to domain-specific answers from internal documents while avoiding AI hallucinations and prompt injection risks. This project provides a secure and user-friendly RAG system to surface relevant passages, return answer citations, and guard against malicious prompts.

## Objectives

- Build a secure search and chat experience for enterprise documents.
- Use a modern web frontend with responsive interfaces and role-based admin pages.
- Implement a backend service with modular AI provider support and logging.
- Ensure transparent answer citations and operational monitoring.
- Prepare deployable artifacts for local and Render/Vercel cloud environments.

## Scope

The implementation covers:

- Document ingestion and chunk-based retrieval
- Semantic search using a lightweight in-memory vector store
- Chat-based question answering with context-aware prompt construction
- User authentication, roles, and admin dashboards
- Audit logging, analytics, and feedback capture
- Deployment support via Docker Compose and Render/Vercel compatibility

## Technology Stack

- Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS
- Backend: FastAPI, Python 3.13, Pydantic, Motor (MongoDB async)
- Database: MongoDB for user, document, analytics, and audit data
- LLM Gateway: Mistral API as single provider
- DevOps: Docker Compose, Render deployment manifest, Vercel-ready frontend

## Key Features

- Authenticated user registration, login, and password reset flows
- Document upload, search filters, and knowledge graph support
- Conversational question answering with citations and token usage
- Prompt injection detection on user queries
- Admin panels for documents, feedback, audit logs, analytics, and security
- Deployment-ready configuration for local dev and cloud

## Implementation Summary

### Backend

- `backend/app/core/config.py` manages environment settings and ensures Mistral-only provider flow.
- `backend/app/services/llm_gateway.py` builds prompt text and invokes Mistral via a single provider call.
- `backend/app/services/rag.py` controls retrieval, citation assembly, prompt injection detection, and query tracking.
- `backend/app/db/vector.py` implements a simple in-memory vector search layer for document chunks.

### Frontend

- `frontend/app/page.tsx` and nested route pages provide UI for chat, documents, analytics, and admin tasks.
- `frontend/components` include reusable shell and page layout components.
- `frontend/lib/api.ts` centralizes API fetch functions and error handling.

## Testing and Validation

- Backend unit tests verify security checks and core service behavior.
- Frontend build validation was confirmed with `npm run build` after the Next.js upgrade.
- Python syntax validation and dependency checks were verified for the updated backend runtime.

## Results and Outcomes

- The app now supports a single trusted LLM provider (`Mistral`) with fallback removed.
- The Render backend runtime is pinned to Python 3.13 to avoid `tokenizers`/PyO3 build failures.
- Documentation is expanded to support deployment, architecture review, and submission packaging.

## Challenges

- Ensuring compatibility between Render's Python runtime and LLM-related native dependencies.
- Removing multi-provider fallback logic while preserving a stable production-ready gateway.
- Documenting a broad full-stack system in a clear package suitable for academic evaluation.

## Future Enhancements

- Replace the in-memory vector store with a production vector database such as Chroma or Pinecone.
- Add streaming responses for chat sessions and multi-turn conversation state.
- Enhance analytics with user behavior dashboards and heatmaps.
- Add end-to-end tests for UI flows and deployment smoke tests.

## Conclusion

This repository is packaged as a deployable, maintainable RAG platform with a clear focus on security, citation transparency, and modern web stack integration.
