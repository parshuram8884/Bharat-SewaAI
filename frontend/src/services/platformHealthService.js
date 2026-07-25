import { storageRegistryService } from './storageRegistryService';

export const platformHealthService = {
  getPlatformHealth() {
    const storageHealth = storageRegistryService.validateAllStorage();
    const corrupted = storageHealth.filter(s => s.status === 'corrupted');
    
    const isOnline = navigator.onLine !== false;

    let overall = 'healthy';
    if (!isOnline) overall = 'degraded';
    if (corrupted.length > 0) overall = 'critical';

    return {
      status: overall,
      lastChecked: new Date().toISOString(),
      details: {
        online: isOnline,
        storage: storageHealth,
        corruptedStores: corrupted.length
      }
    };
  }
};
