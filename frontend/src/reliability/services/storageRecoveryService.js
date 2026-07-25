/**
 * Validates storage domains and safely resets corrupted records without wiping all storage.
 */

class StorageRecoveryService {
  constructor() {
    this.domains = [
      'bsai_user',
      'bsai_preferences',
      'bsai_assistance_preferences',
      'bsai_network_simulation'
    ];
  }

  validateStorage() {
    const report = { healthy: true, corruptedDomains: [] };

    for (const domain of this.domains) {
      try {
        const item = localStorage.getItem(domain);
        if (item) {
          // Attempt parse if it looks like JSON
          if (item.startsWith('{') || item.startsWith('[')) {
            JSON.parse(item);
          }
        }
      } catch (e) {
        report.healthy = false;
        report.corruptedDomains.push(domain);
      }
    }

    return report;
  }

  recoverCorruptedDomains(corruptedDomains) {
    const recovered = [];
    for (const domain of corruptedDomains) {
      try {
        localStorage.removeItem(domain); // Safe reset of just the corrupted domain
        recovered.push(domain);
      } catch (e) {
        console.error(`Failed to clear corrupted domain ${domain}`, e);
      }
    }
    return recovered;
  }
}

export const storageRecoveryService = new StorageRecoveryService();
