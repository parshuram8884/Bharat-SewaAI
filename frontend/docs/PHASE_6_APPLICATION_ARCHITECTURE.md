# Phase 6: Application Workflow & Submission Architecture

## Overview
Phase 6 establishes a full citizen-facing government scheme application workflow for **Bharat Sewa AI**.

## System Topology & Layers

```mermaid
graph TD
    A[App Routes App.jsx] --> B[Citizen Navigation & Layout]
    B --> C[Application Flow Pages src/pages/applications/]
    C --> D[Reusable Component Suite src/components/applications/]
    C --> E[React Query Custom Hooks useApplicationQuery.js]
    E --> F[Application Service Layer applicationService.js]
    F --> G[Validation Module applicationValidation.js]
    F --> H[localStorage Application DB]
    C --> I[Application UI Store applicationUiStore.js]
```

## State Management Principles
1. **Server Data (React Query - `useApplicationQuery.js`)**:
   - Handles async application record retrieval, list queries, section updates, document attachments, validation queries, and submission mutations.
2. **Client UI State (Zustand - `applicationUiStore.js`)**:
   - Tracks active step indices, active section IDs, modal dialog states (`isSaveAndExitDialogOpen`, `isSubmitDialogOpen`), and unsaved draft flags.
3. **Draft Persistence (`applicationService.js`)**:
   - Persists application drafts to `localStorage` (`bharat_sewa_applications_v1`).
   - Prevents duplicate draft creation per citizen and scheme.
