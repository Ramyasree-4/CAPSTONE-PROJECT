# Security Documentation

Security controls included in the starter implementation:

- JWT access tokens and refresh tokens.
- BCrypt password hashing.
- Route-level RBAC permissions.
- Upload extension and size validation.
- Prompt-injection heuristics before retrieval.
- Centralized audit and security event logging.
- Environment variables for secrets and provider keys.
- Rate limiting middleware hook.
- Sensitive value masking helper for logs.

Production hardening checklist:

- Store refresh tokens as hashed records with rotation and revocation.
- Enforce HTTPS and secure cookies when using browser sessions.
- Configure MongoDB Atlas IP allowlists and least-privilege database users.
- Use a managed secret store for provider keys.
- Add malware scanning for uploaded files.
- Enable object storage with server-side encryption.
- Route logs to a SIEM.

