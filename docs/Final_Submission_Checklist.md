# Final Submission Checklist

## Repository Contents

- [ ] `README.md` updated with project overview and docs links
- [ ] `docs/` folder includes architecture, deployment, user manual, prompt documentation, and presentation content
- [ ] `infra/render.yaml` included for backend deployment
- [ ] `docker-compose.yml` included for local development
- [ ] `.env.example` updated for current Mistral-only configuration
- [ ] `backend/runtime.txt` present for Python 3.13 runtime pin
- [ ] `LICENSE` included if required by submission rules

## Documentation

- [ ] `docs/Project_Documentation.md` created
- [ ] `docs/System_Architecture.md` created
- [ ] `docs/User_Manual.md` created
- [ ] `docs/Deployment_Guide.md` created
- [ ] `docs/Prompt_Document.md` created
- [ ] `docs/Presentation_Content.md` created
- [ ] `docs/Final_Submission_Checklist.md` created
- [ ] `screenshots/SCREENSHOT_CHECKLIST.md` created

## Deployment and Verification

- [ ] Local development run verified with Docker Compose
- [ ] Frontend build verified with `npm run build`
- [ ] Backend Python compatibility verified with Python 3.13
- [ ] Render backend runtime pinned via `backend/runtime.txt`
- [ ] API endpoints documented and ready for use

## Review

- [ ] Confirm no remaining fallback model configuration in backend
- [ ] Confirm prompt injection detection is enabled
- [ ] Confirm docs reference current architecture and deployment plan
- [ ] Confirm README links to new documentation files
- [ ] Confirm `.env.example` only includes required values
