---
project: Bharat Sewa AI
version: 1.0.0
scope: Admin Guide
status: Final
last-updated: 2026-07-25
---

# Admin Guide

Administrators (`platform-operator`, `super-admin`) have access to specific diagnostic tools.

## 1. Demo Control Panel
Located at `/demo-control`. Here, admins can:
- **Reset Scenario Data:** Safely purge `bsai_drafts` and other volatile mock storage without resetting the user's language/theme preferences.
- **Network Simulation:** Inject mock latency (Slow), Force Timeout, or Offline Mode to test the UI's resilience.

## 2. Analytics & Reporting
Located at `/admin/analytics`. Admins can construct dynamic reports using mock Open Data sets via the Report Builder.
