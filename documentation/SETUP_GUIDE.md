# Setup & Installation Guide

Follow these steps to launch the frontend development client and backend API servers locally.

---

## 🔑 Environmental Configurations

Create `.env` files in both the `backend/` and `frontend/` folders.

### 1. Backend Config (`backend/.env`)
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### 2. Frontend Config (`frontend/.env`)
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🚀 Running the Project

### 1. Backend Server Setup
Navigate to the `backend` folder, install packages, and boot the Express app:
```bash
cd backend
npm install
npm run dev
```
*The server will boot on port `5000` (`http://localhost:5000`).*

### 2. Frontend Client Setup
Open a new terminal, navigate to the `frontend` folder, install packages (using legacy peer deps to ensure packages align), and run Vite:
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
*The Vite development client will run on port `5173` (`http://localhost:5173`).*

---

## 🛠️ Troubleshooting & Notes

* **Dependency Conflict Warnings:** Always use the `--legacy-peer-deps` flag when installing new packages in the frontend to avoid conflict overrides.
* **White Screen Crashes:** The application has a global Error Boundary configured in `App.jsx`. If a component crashes due to a missing network endpoint or query configuration, it will display a diagnostic card instead of a blank screen.
* **Mock Authentication Fallback:** If Clerk credentials are not added to `.env`, the app automatically falls back to a mock local profile for **Farmer Ramesh (`9876543210`)**, allowing judges to test the entire application lifecycle end-to-end without signing up.
