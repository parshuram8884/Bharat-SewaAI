---
project: Bharat Sewa AI
version: 1.0.0
scope: Deployment Guide
status: Final
last-updated: 2026-07-25
---

# Deployment Guide

Although Bharat Sewa AI v1.0.0 is a frontend-only demonstration, it can be deployed as a static site to standard hosting providers (Vercel, Netlify, AWS S3, GitHub Pages).

## 1. Build Process
Run the following command to generate the static bundle:
```bash
npm run build
```
The output will be placed in the `/dist` directory.

## 2. Deployment Checklist
- [x] **Base Path Configuration:** If deploying to a subfolder (e.g., GitHub Pages), update the `base` property in `vite.config.js`.
- [x] **Routing Fallbacks:** Because this is a Client-Side Rendered (CSR) SPA using React Router, ensure the hosting provider rewrites all 404 requests to `index.html`.
- [x] **Environment Variables:** Ensure `.env.production` (if used) contains no real backend secrets, only UI keys.
- [x] **Asset Optimization:** Vite inherently handles chunking and minification via esbuild/rolldown.

## 3. Serving Locally
To preview the production build locally:
```bash
npm run preview
```
