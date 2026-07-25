/**
 * searchIndexService.js
 * Static/derived registry of searchable frontend mock data.
 */

export const searchIndexService = {
  getFullIndex() {
    // In a real frontend-only scenario, this would dynamically pull from localStorage schemas.
    // For this demonstration, we return a statically constructed index simulating the database.
    return [
      {
        id: 'idx_scheme_1',
        resourceType: 'scheme',
        title: 'PM Kisan Samman Nidhi',
        searchableText: 'farmer financial assistance 6000 rupees agriculture',
        route: '/schemes/pm-kisan',
        module: 'schemes',
        requiredRoles: ['citizen', 'officer', 'department-admin', 'super-admin'],
      },
      {
        id: 'idx_csc_1',
        resourceType: 'csc',
        title: 'Delhi CSC Center - Connaught Place',
        searchableText: 'delhi center assisted booking appointment',
        route: '/csc/centers/delhi-1',
        module: 'csc',
        requiredRoles: ['citizen', 'csc-operator', 'csc-manager'],
        featureFlag: 'enable-csc-module'
      },
      {
        id: 'idx_sec_event_1',
        resourceType: 'security',
        title: 'Security Access Logs',
        searchableText: 'audit event permission denied unauthorized',
        route: '/admin/security/overview',
        module: 'security',
        requiredRoles: ['security-auditor', 'platform-operator', 'super-admin'],
        featureFlag: 'enable-security-dashboard'
      }
    ];
  }
};
