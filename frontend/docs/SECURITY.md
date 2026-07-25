---
project: Bharat Sewa AI
version: 1.0.0
scope: Security Guide
status: Final
last-updated: 2026-07-25
---

# Security Architecture

For a detailed security audit, please refer to the [Security Review Report](./reports/SECURITY_REVIEW.md).

## Highlights
- **Role Isolation:** Enforced on the client-side via `PermissionGuard`.
- **Volatile Authentication:** Fake JWTs are simulated via Clerk; no persistent credential storage is utilized.
- **Error Obfuscation:** The Phase 20 Error Boundaries catch raw stack traces and mask them behind user-friendly generic fallback components (e.g., `Diagnostic Ref: ERR_1X9`).
