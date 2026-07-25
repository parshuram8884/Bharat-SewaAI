---
project: Bharat Sewa AI
version: 1.0.0
scope: Known Limitations
status: Final
last-updated: 2026-07-25
---

# Known Limitations

This document explicitly details the boundaries of Bharat Sewa AI v1.0.0. **This is a frontend-only demonstration platform.**

## 1. Architecture Limitations
- **No Backend Infrastructure:** There are no Node/Express, Python, or external API servers. All `api/` calls are intercepted by mock frontend services.
- **No Database:** `localStorage` is used to simulate a database. It is volatile, unencrypted, and limited to 5MB-10MB depending on the browser.
- **No Real Authentication:** The Clerk UI is simulated or mocked. Real JWTs are not validated securely against a backend, meaning "role switching" is merely a UI state change.

## 2. Functional Limitations
- **File Uploads (OCR/Digilocker):** Clicking "Upload" simulates a delay and randomly returns a success or failure state. No actual file parsing or AI extraction takes place.
- **Search:** The universal search filters static JSON payloads rather than querying a real Elasticsearch/Algolia index.
- **Assistance Engine:** The rule engine evaluates deterministic JSON objects, not LLMs. It cannot "answer" arbitrary text questions.

## 3. Technical Debt
- **Linting Errors:** Approximately 400 `no-unused-vars` warnings exist in legacy Phase 1-15 services. These were retained to avoid accidentally breaking fragile mock configurations late in the cycle.
- **Eager Loading:** Many routes inside `App.jsx` are eager-loaded. Only the heaviest modules (Admin, Security, Demo Controls) are lazy-loaded.

## 4. Security Considerations
- Because there is no backend, all validation happens on the client. A user with Chrome DevTools can bypass form validation and access restricted routes by modifying `localStorage`. **Do not deploy this code to production with real PII.**
