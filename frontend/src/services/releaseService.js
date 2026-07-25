/**
 * releaseService.js
 * Creates structured mock release snapshots.
 */
import { releaseConfig, ReleaseStatuses } from '../config/releaseConfig';
import { featureFlags } from '../config/featureFlags';
import { routeRegistryService } from './routeRegistryService';
import { finalQaService } from './finalQaService';
import { environment } from '../config/environment';

export const releaseService = {
  getCurrentRelease() {
    return {
      id: 'rel_' + Date.now(),
      version: releaseConfig.currentVersion,
      releaseName: environment.appName,
      buildTimestamp: releaseConfig.buildTimestamp,
      environment: environment.env,
      status: ReleaseStatuses.APPROVED_DEMO,
      includedPhases: releaseConfig.includedPhases,
      migrationVersion: releaseConfig.migrationVersion,
      cacheVersion: releaseConfig.cacheVersion
    };
  },
  getReleaseReadiness() {
    const qa = finalQaService.getQaChecklist();
    return {
      buildPassed: !qa.find(q => q.category === 'build' && q.status === 'failed'),
      lintPassed: !qa.find(q => q.category === 'lint' && q.status === 'failed'),
      testsPassed: true, // Mocked
      routeValidationPassed: true,
      integrityPassed: true,
      accessibilityPassed: true,
      responsivePassed: true,
      pwaPassed: environment.enablePwa,
      offlinePassed: true,
      performanceReviewed: true,
      securityReviewed: true,
      documentationComplete: true,
      status: 'ready-demo'
    };
  },
  getEnabledFeaturesForRelease() {
    return Object.keys(featureFlags).map(k => ({
      key: k,
      enabled: featureFlags[k].enabledByDefault
    }));
  }
};
