# API Documentation

Base path: `/api/v1`

## Auth

- `POST /auth/register`: create a user.
- `POST /auth/login`: issue access and refresh tokens.
- `POST /auth/refresh`: rotate an access token.
- `POST /auth/password-reset/request`: request password reset flow.
- `POST /auth/password-reset/confirm`: set a new password.
- `GET /auth/me`: return current profile.
- `PATCH /auth/me`: update profile.

## Admin

- `GET /admin/users`: list users.
- `PATCH /admin/users/{user_id}/role`: update user role.
- `GET /admin/audit-logs`: list audit events.
- `GET /admin/security-logs`: list security events.

## Documents

- `POST /documents`: upload a document.
- `GET /documents`: search and filter documents.
- `GET /documents/{document_id}`: document detail.
- `PATCH /documents/{document_id}`: update metadata.
- `DELETE /documents/{document_id}`: delete a document.

## RAG

- `POST /rag/chat`: run retrieval and generation.
- `GET /rag/conversations`: list conversations.
- `GET /rag/conversations/{conversation_id}`: read conversation history.
- `GET /rag/queries/{query_id}/export`: export a response and citations.

## Evaluation

- `POST /evaluations/{query_id}`: evaluate a query.
- `GET /evaluations`: list evaluations and trends.

## Feedback

- `POST /feedback`: submit rating or issue report.
- `GET /feedback/analytics`: feedback analytics.

## Analytics

- `GET /analytics/overview`: system, RAG, and LLM metrics.
- `GET /analytics/usage`: usage monitoring.

