import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/react';
import './index.css';
import App from './App.jsx';

console.log("VITE_CLERK_PUBLISHABLE_KEY:", import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

import { DesignSystemProvider } from './design-system/foundations/DesignSystemProvider';
import { DialogProvider } from './design-system/components/Dialog';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider afterSignOutUrl="/">
      <DesignSystemProvider>
        <DialogProvider>
          <App />
        </DialogProvider>
      </DesignSystemProvider>
    </ClerkProvider>
  </StrictMode>,
);

