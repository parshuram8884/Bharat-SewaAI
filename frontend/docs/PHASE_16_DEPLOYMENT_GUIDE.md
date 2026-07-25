# Phase 16 Deployment Guide

This guide provides instructions for deploying the Bharat Sewa AI demonstration application to static hosting providers.

> [!CAUTION]
> This deployment simulation is for testing the UI only. There is no backend, so all data persists in the client's local browser storage. Do not connect real database credentials to these environments.

## 1. Prerequisites
- Node.js v18+
- npm v9+

## 2. Environment Configuration
Create a `.env.production` file:
```env
VITE_APP_NAME="Bharat Sewa AI Demo"
VITE_APP_VERSION="BSAI-DEMO-1.0.0"
VITE_APP_ENVIRONMENT="production-demo"
VITE_ENABLE_PWA="true"
```
*(Frontend environment variables are visible in the built application and must not be treated as secrets).*

## 3. Build Command
Execute the Vite build process:
```bash
npm install
npm run build
```

## 4. Output Directory
The compiled artifacts will be located in the `dist/` directory.

## 5. SPA Fallback (Routing)
Because Bharat Sewa AI uses React Router (Client-Side Routing), you must configure your static host to rewrite all 404s to `index.html`.

### Vercel (`vercel.json`)
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Netlify (`_redirects`)
```
/* /index.html 200
```

### Firebase Hosting (`firebase.json`)
```json
{
  "hosting": {
    "public": "dist",
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

## 6. Rollback Procedure
Since there is no database schema to rollback, "rolling back" involves redirecting your hosting provider's active branch or pointer to a previously compiled commit of the repository. Data created by users in `localStorage` in the interim may become orphaned if the newer features are removed.
