# Phase 16 Known Limitations

This document serves as the official limitation registry for the Bharat Sewa AI demonstration platform.

> [!CAUTION]
> This is a frontend-only demonstration. It lacks the secure infrastructure required to handle real government, financial, or personally identifiable information (PII).

## Architecture Limitations
1. **Frontend-Only Security**: All permissions, route guards, and feature flags are executed client-side. They can be bypassed by inspecting network requests or modifying the client bundle.
2. **localStorage Limitations**: The entire database is simulated using the browser's `localStorage` API, which limits storage size (usually 5MB), prevents cross-device syncing, and is susceptible to being cleared by the user.
3. **No Backend**: There is no server running Node.js, Python, or Java to validate states or perform background scheduled jobs.
4. **No Real Authentication**: Logins are simulated via explicit profile selection. There are no passwords, OAuth flows, or MFA mechanisms.

## Integration Limitations
1. **No Real Government APIs**: Schemes, eligibility engines, and application forms do not connect to state or central government backend systems.
2. **No Real Payment Processing**: The DBT (Direct Benefit Transfer) simulation and sanction releases do not communicate with NPCI, PFMS, or any banking API.
3. **No Real Document Verification**: The DigiLocker integration and eSign mechanisms are completely mocked with artificial loading states. Aadhaar / UIDAI endpoints are not contacted.
4. **No Real CSC Network**: Citizen Service Centre locations, queues, and tokens exist entirely within the local demo data.
5. **No Real Analytics Warehouse**: Executive dashboards perform naive in-memory array aggregations instead of querying a Snowflake or PowerBI cube.

## Operational Limitations
1. **Local-Device-Only**: Demonstration data seeded on one computer cannot be viewed by a user on another computer unless the state is explicitly exported and imported manually.
2. **No Production Monitoring**: There is no Datadog, Sentry, or Splunk attached to track errors safely.
3. **Browser-Dependent PWA Installation**: iOS Safari may have varying levels of support for the service worker installation prompt compared to Android Chrome.
4. **No Real Backup or Disaster Recovery**: If `localStorage` is corrupted and cannot be repaired by the `platformHealthService`, the data is permanently lost.
