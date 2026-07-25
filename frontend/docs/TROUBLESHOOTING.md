---
project: Bharat Sewa AI
version: 1.0.0
scope: Troubleshooting
status: Final
last-updated: 2026-07-25
---

# Troubleshooting Guide

## 1. Stuck in a Loading State?
- The network simulator might be set to "Timeout" or "Slow". Visit `/demo-control` to reset it to "Normal".

## 2. Forms Not Saving?
- Your browser's `localStorage` may have hit its 5MB quota. Check your DevTools Application tab.
- Click "Reset Demonstration Data" in `/demo-control` to clear old diagnostics.

## 3. Page Crashes or White Screen?
- Phase 20 Error Boundaries should catch most crashes and show a fallback. If a true white screen occurs, check your browser console for `ChunkLoadError`. A hard refresh (`Ctrl + F5`) usually resolves Vite dynamic import mismatches.
