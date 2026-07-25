# Phase 20 Performance Baseline

**Date recorded:** 2026-07-25
**Measurement Tool:** `vite build` local output

## Initial Bundle Baseline
Before applying Phase 20 optimisations, the main application is heavily eager-loaded, resulting in a single massive JS chunk.

- **Main index.js chunk size:** ~1,579.06 kB (unminified/raw) / ~385.23 kB (gzip)
- **Warning:** `(!) Some chunks are larger than 500 kB after minification.`
- **Number of Lazy Chunks:** 3 (SecurityOverviewPage, PlatformHealthPage, DesignSystemLayout)

## Goals
By strategically applying route-level code splitting via `React.lazy()` and segregating Admin/Diagnostics/Officer/Analytics workflows into separate route modules, we aim to reduce the initial load `index.js` chunk size significantly and distribute the load across on-demand chunks.
