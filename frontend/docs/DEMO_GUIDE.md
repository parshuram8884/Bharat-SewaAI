---
project: Bharat Sewa AI
version: 1.0.0
scope: Demo Guide
status: Final
last-updated: 2026-07-25
---

# Final Demonstration Guide

This script ensures a flawless presentation of Bharat Sewa AI v1.0.0.

## 1. Preparation
- Run `npm run dev` to start the local Vite server.
- Clear `localStorage` manually if starting fresh, OR navigate to `/demo-control` and click "Reset Demonstration Data".

## 2. Act 1: The Citizen Workflow
1. Navigate to `/`. 
2. Open the **Assistant Panel** (top right sparkles icon) and demonstrate the deterministic rule suggestions.
3. Start an application draft. Type in a few fields, wait 1 second for the debounce, and hit refresh. The draft will securely recover via `formRecoveryService`.
4. Submit the mock application to showcase the success tracking timeline.

## 3. Act 2: The Officer Queue
1. Log in as an Officer via `/officer/login`.
2. Open the Assigned Queue.
3. Review the citizen's application. Demonstrate the UI focus-trapping on the Clarification Dialog.

## 4. Act 3: Reliability & Performance
1. Navigate to `/demo-control`.
2. Change the Network Simulation to **Timeout**.
3. Attempt to load a fresh report in the Analytics module. The application will pause, and eventually show the `RouteErrorFallback` with a "Try Again" button, proving that one timeout does not crash the app.
4. Change the Network Simulation back to **Normal**.

## 5. Act 4: Accessibility
- Toggle High Contrast and Reduced Motion via the Profile preferences. Show how the Design System seamlessly respects CSS variables.
