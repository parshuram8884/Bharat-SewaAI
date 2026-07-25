# Bharat Sewa AI

Bharat Sewa AI is an intelligent conversational platform utilizing AI to serve assistant capabilities, document extraction, and scheme recommendations.

## Project Structure

This repository is organized as a monorepo containing two main parts:
- **`backend/`**: An Express API server utilizing Supabase, Clerk, and Google Gemini.
- **`frontend/`**: A React application built with Vite and TailwindCSS.

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

To set up both the backend and frontend, run the following commands:

#### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the `.env` file with your credentials (see `.env` example in the backend folder).
4. Run the development server:
   ```bash
   npm run dev
   ```

#### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Technologies Used
- **Frontend**: React, Vite, TailwindCSS, Clerk (Auth)
- **Backend**: Node.js, Express, Google Gemini SDK, Supabase (Database/Storage), Clerk (Auth verification)
