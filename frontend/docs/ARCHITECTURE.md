---
project: Bharat Sewa AI
version: 1.0.0
scope: Architecture Guide
status: Final
last-updated: 2026-07-25
---

# Architecture Overview

This document expands on the [Architecture Review](./reports/ARCHITECTURE_REVIEW.md).

## Core Principles
1. **Frontend Isolation:** Absolutely zero server-side logic.
2. **Mock Persistence:** The `storageRegistryService` isolates mock data domains (e.g., `bsai_drafts`, `bsai_preferences`) to simulate real database tables.
3. **Design System Consistency:** Phase 18 unified the UI into `src/design-system`, strictly using Tailwind and CSS variables for theming.
4. **Reliability First:** Phase 20 introduced a tri-layer Error Boundary architecture to prevent full-app crashes.

## State Management
- **React Query:** Used for asynchronous mock API requests. Configured globally with safe retry backoff.
- **Zustand:** Used for synchronous, transient UI state (e.g., Assistance Panel open/close).

## Module Code Splitting
To prevent a monolithic bundle, large administrative modules (Security, Analytics, Demo Control) are dynamically imported via `React.lazy()`.
