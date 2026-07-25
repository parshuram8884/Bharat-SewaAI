import { environment } from './environment';

export const ReleaseStatuses = {
  DRAFT: 'draft',
  RELEASE_CANDIDATE: 'release-candidate',
  APPROVED_DEMO: 'approved-demo',
  DEPLOYED_DEMO: 'deployed-demo',
  ROLLED_BACK_DEMO: 'rolled-back-demo',
  ARCHIVED: 'archived'
};

export const releaseConfig = {
  currentVersion: environment.appVersion,
  migrationVersion: 'v16',
  cacheVersion: 'bsai-v16',
  buildTimestamp: new Date().toISOString(),
  includedPhases: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]
};

export const releasePermissions = {
  RELEASE_DIAGNOSTICS_VIEW: 'release:diagnostics:view',
  RELEASE_CANDIDATE_CREATE: 'release:candidate:create',
  RELEASE_DEMO_APPROVE: 'release:demo:approve',
  RELEASE_DEPLOY_MARK: 'release:deploy:mark',
  RELEASE_ROLLBACK_REQUEST: 'release:rollback:request',
  RELEASE_ROLLBACK_APPROVE: 'release:rollback:approve'
};
