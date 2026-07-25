---
project: Bharat Sewa AI
version: 1.0.0
scope: Future Scope
status: Final
last-updated: 2026-07-25
---

# Future Scope & Production Path

This document outlines the roadmap for migrating the V1.0.0 frontend demonstration into a production-ready full-stack application.

## 1. Backend Migration
- **Remove Mock Services:** Deprecate `src/services/*DemoDataService.js`.
- **Introduce API Layer:** Replace Axios mock intercepts with real REST or GraphQL endpoints connecting to a Node.js/Python microservices backend.
- **Database Integration:** Replace `localStorage` with real databases (e.g., PostgreSQL for transactions, MongoDB for document storage, Redis for session caching).

## 2. Authentication & Authorization
- **Real JWT Validation:** Ensure Clerk/Auth0 tokens are validated securely on the backend.
- **Server-Side Role Checks:** Move `PermissionGuard` logic to the backend to prevent API exploitation.

## 3. Real AI Services
- **OCR Implementation:** Replace the simulated `DocumentExtractingPage` timers with actual Tesseract or AWS Textract integrations.
- **Chatbot Backend:** Connect the Phase 4 Assistant UI to a real LLM (e.g., OpenAI, Gemini, or LLaMA) with LangChain for semantic retrieval.

## 4. Performance & Infrastructure
- **Server-Side Rendering:** Consider migrating the React+Vite SPA to Next.js for better SEO and initial load times.
- **Cloud Telemetry:** Introduce Datadog, Sentry, or LogRocket to replace the current console-based frontend error boundaries.
