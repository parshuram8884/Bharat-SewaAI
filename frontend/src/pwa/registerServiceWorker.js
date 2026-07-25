export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
          
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Dispatch event for UI update prompt
                window.dispatchEvent(new CustomEvent('pwa-update-available', { detail: newWorker }));
              }
            });
          });
        })
        .catch(registrationError => {
          console.error('SW registration failed: ', registrationError);
        });
    });
  }
}

export function triggerServiceWorkerUpdate(newWorker) {
  if (newWorker) {
    newWorker.postMessage({ type: 'SKIP_WAITING' });
  }
}
