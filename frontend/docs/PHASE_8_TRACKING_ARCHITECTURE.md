# Phase 8: Application Tracking Architecture

## 1. Overview
The Application Tracking module provides citizens with a completely mocked, comprehensive post-submission tracking hub. It simulates the lifecycle of government scheme applications without connecting to real department systems.

## 2. Component Structure
```text
/applications (ApplicationsListPage)
  ├── Search & Filter via URL Params (?status=Needs+Attention)
  └── List of Applications

/applications/:applicationId (ApplicationTrackingHubPage)
  ├── Status Progress Tracker
  ├── Active Action Required Cards (Docs/Clarification)
  └── Sub-navigation links
       ├── /timeline -> ApplicationTimelinePage
       ├── /status -> ApplicationStatusPage
       ├── /remarks -> ApplicationRemarksPage
       ├── /documents/respond -> DocumentRespondPage
       ├── /clarification/respond -> ClarificationRespondPage
       ├── /history -> ApplicationHistoryPage
       ├── /download -> ApplicationDownloadPage
       └── /withdraw -> ApplicationWithdrawPage
```

## 3. State Management Division
- **Server State**: Managed strictly via `@tanstack/react-query` using `useApplicationTrackingQuery.js` which points to `applicationTrackingService.js`.
- **UI State**: Temporary dialog open/close states managed via Zustand `useApplicationTrackingUiStore.js`. Search/filters are pushed strictly to the URL.

## 4. Request Resolution
Document and Clarification requests trigger explicit state transitions within the `applicationTrackingService.js`. Submitting a response advances the internal request status to `submitted`, appends a public timeline event, appends an internal history event, pushes an application status transition, and creates a deduplicated notification.
