import { permissionService } from './permissionService';
import { GrievancePublicStatus } from '../data/grievancePublicStatusModel';

const GRIEVANCES_KEY = 'bharat_sewa_grievances_v1';
const AUDIT_KEY = 'bharat_sewa_grievance_audit_v1';

const getStore = (key) => JSON.parse(localStorage.getItem(key) || '[]');

export const grievanceAdminService = {
  
  getGrievanceAnalytics(user, filters = {}) {
    if (!user) return null;
    if (!permissionService.canManageGrievanceConfig(user) && !permissionService.hasPermission(user, 'analytics.view')) {
      throw new Error('Unauthorized');
    }

    let all = getStore(GRIEVANCES_KEY);
    
    // Dept filtering
    if (!permissionService.canViewGrievance(user, { departmentId: 'dummy' })) {
        all = all.filter(g => permissionService.canAccessDepartment(user, g.departmentId));
    }

    if (filters.departmentId) all = all.filter(g => g.departmentId === filters.departmentId);

    const total = all.length;
    const open = all.filter(g => g.publicStatus !== GrievancePublicStatus.CLOSED && g.publicStatus !== GrievancePublicStatus.RESOLVED && g.publicStatus !== GrievancePublicStatus.WITHDRAWN && g.publicStatus !== GrievancePublicStatus.CANCELLED).length;
    const closed = all.filter(g => g.publicStatus === GrievancePublicStatus.CLOSED).length;
    const escalated = all.filter(g => g.publicStatus === GrievancePublicStatus.ESCALATED || g.escalationLevel !== 'level-0').length;
    const reopened = all.filter(g => g.publicStatus === GrievancePublicStatus.REOPENED).length;

    return {
      success: true,
      data: {
        totalGrievances: total,
        openGrievances: open,
        closedGrievances: closed,
        escalatedGrievances: escalated,
        reopenedGrievances: reopened,
        resolutionRate: total > 0 ? Math.round((closed / total) * 100) : 0,
        averageResolutionTime: 5, // Mock days
        slaCompliance: 85, // Mock %
      }
    };
  },

  getGlobalGrievanceAudit(user) {
    if (!user) return [];
    if (!permissionService.hasPermission(user, 'grievance.audit_view')) {
      throw new Error('Unauthorized');
    }
    
    let all = getStore(AUDIT_KEY);
    // Sort descending by timestamp
    all.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return all;
  }
};
