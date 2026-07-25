import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  // navigator.onLine is just a hint. It being true doesn't mean the server is reachable.
  const [status, setStatus] = useState(navigator.onLine ? 'online' : 'offline');

  useEffect(() => {
    const handleOnline = () => setStatus('online');
    const handleOffline = () => setStatus('offline');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return status;
}
