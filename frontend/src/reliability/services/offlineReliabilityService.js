/**
 * Tracks offline readiness and degraded modes.
 */
class OfflineReliabilityService {
  constructor() {
    this.safeFeatures = new Set([
      'draft-editing',
      'help-content',
      'design-system-catalogue',
      'demo-checklists',
      'preferences'
    ]);
  }

  isFeatureAvailableOffline(featureId) {
    return this.safeFeatures.has(featureId);
  }

  getOfflineRestrictions() {
    return [
      'Simulated submissions requiring mock request flow',
      'Cross-workspace actions',
      'Fetching new uncached records'
    ];
  }
}

export const offlineReliabilityService = new OfflineReliabilityService();
