# Presentation Content

## Project Title

Enterprise RAG Platform with Secure LLM Augmented Search

## Slide 1: Introduction

- Problem: Knowledge discovery is hard in document-heavy environments.
- Solution: A full-stack RAG platform with authenticated access, document management, and LLM-powered conversational search.
- Goal: Demonstrate a deployable, secure, citation-aware QA system.

## Slide 2: Architecture

- Frontend: Next.js + TypeScript + Tailwind
- Backend: FastAPI + Python
- Storage: MongoDB
- LLM Gateway: Mistral
- Deployment: Docker Compose + Render/Vercel

## Slide 3: Key Features

- Secure login and user roles
- Document upload and management
- Conversational retrieval and citation
- Prompt injection detection and audit logging
- Analytics and admin dashboards

## Slide 4: Technical Highlights

- Single-provider LLM gateway simplified to Mistral
- Python 3.13 runtime pin to avoid build issues
- In-memory vector search for fast semantic retrieval
- Transparent metrics for token usage and cost estimation
- Clean separation of frontend and backend concerns

## Slide 5: Demo Flow

1. User logs in or registers.
2. User uploads documents or selects a dataset.
3. User asks a question in the chat interface.
4. Backend retrieves relevant chunks, calls Mistral, and returns a grounded answer.
5. User sees citations and optionally submits feedback.

## Slide 6: Challenges and Resolutions

- Issue: Render backend build failed due to Python 3.14 / `tokenizers` mismatch.
- Fix: Pinned backend runtime to Python 3.13 in `backend/runtime.txt`.
- Issue: Multi-provider fallback complexity.
- Fix: Simplified provider stack to Mistral only.

## Slide 7: Results

- Stable frontend build with Next.js 15.5.19
- Working backend architecture with a single model provider
- Comprehensive deployment and documentation package

## Slide 8: Future Work

- Integrate a true vector database
- Add conversational state and multi-turn memory
- Improve analytics and evaluation dashboards
- Support additional secure LLM providers if needed

## Slide 9: Conclusion

- This project delivers a ready-to-deploy RAG system for enterprise knowledge access.
- It emphasizes security, transparency, and maintainability.
- The codebase is documented and prepared for academic submission.
