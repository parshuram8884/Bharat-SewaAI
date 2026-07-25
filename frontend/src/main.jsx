import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import './index.css';
import App from './App.jsx';

// Import Clerk Publishable Key from environmental settings
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const isValidClerkKey = Boolean(
  PUBLISHABLE_KEY &&
  PUBLISHABLE_KEY !== 'pk_test_placeholder' &&
  PUBLISHABLE_KEY.startsWith('pk_')
);

if (!isValidClerkKey) {
  console.warn(
    "[%cClerk Auth Notice%c] VITE_CLERK_PUBLISHABLE_KEY is set to placeholder ('" + PUBLISHABLE_KEY + "') or missing in .env.\n" +
    "To enable Clerk authentication on citizen routes, add your valid Clerk Publishable Key from https://dashboard.clerk.com to .env or .env.local.",
    "color: #10b981; font-weight: bold;",
    "color: inherit;"
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isValidClerkKey ? (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    ) : (
      <App />
    )}
  </StrictMode>,
);
