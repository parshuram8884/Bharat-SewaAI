import { officerAuthService } from './officerAuthService';
import { permissionService } from './permissionService';
import { Permissions } from '../data/officerPermissionModel';

const DEPARTMENTS_KEY = 'bharat_sewa_departments_v1';
const OFFICERS_KEY = 'bharat_sewa_officers_v1';
const APPLICATIONS_KEY = 'bharat_sewa_applications_v1';
const AUDIT_KEY = 'bharat_sewa_audit_v1';

const delay = (ms = 300) => new Promise(res => setTimeout(res, ms));

const getStore = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch (e) {
    return [];
  }
};

export const adminService = {
  async getDepartments() {
    await delay();
    const user = officerAuthService.getCurrentUser();
    if (!user) return { success: false, message: 'Unauthenticated' };
    
    // Admins only
    if (!permissionService.hasAnyPermission(user, [Permissions.DEPARTMENTS_MANAGE, Permissions.ANALYTICS_VIEW, Permissions.OFFICERS_MANAGE])) {
      return { success: false, message: 'Permission denied' };
    }
    
    let depts = getStore(DEPARTMENTS_KEY);
    if (user.departmentId !== 'all') {
      depts = depts.filter(d => d.id === user.departmentId);
    }
    return { success: true, data: depts };
  },

  async getOfficers() {
    await delay();
    const user = officerAuthService.getCurrentUser();
    if (!permissionService.hasPermission(user, Permissions.OFFICERS_MANAGE)) {
      return { success: false, message: 'Permission denied' };
    }

    let officers = getStore(OFFICERS_KEY);
    if (user.departmentId !== 'all') {
      officers = officers.filter(o => o.departmentId === user.departmentId);
    }
    return { success: true, data: officers };
  },

  async getAdminAnalytics() {
    await delay();
    const user = officerAuthService.getCurrentUser();
    if (!permissionService.hasPermission(user, Permissions.ANALYTICS_VIEW)) {
      return { success: false, message: 'Permission denied' };
    }

    const apps = getStore(APPLICATIONS_KEY);
    
    // We compute stats on the fly
    const totalApps = apps.length;
    const approved = apps.filter(a => a.internalStatus === 'approved').length;
    const rejected = apps.filter(a => a.internalStatus === 'rejected').length;
    const underReview = apps.filter(a => a.internalStatus && a.internalStatus !== 'approved' && a.internalStatus !== 'rejected' && a.internalStatus !== 'closed').length;

    const approvalRate = totalApps > 0 ? Math.round((approved / totalApps) * 100) : 0;
    
    return {
      success: true,
      data: {
        totalApplications: totalApps,
        approved,
        rejected,
        underReview,
        approvalRate,
        needsAttention: apps.filter(a => a.needsAttention).length
      }
    };
  },
  
  async getGlobalAuditLog() {
    await delay();
    const user = officerAuthService.getCurrentUser();
    if (!permissionService.hasPermission(user, Permissions.AUDIT_VIEW)) {
      return { success: false, message: 'Permission denied' };
    }
    
    let logs = getStore(AUDIT_KEY);
    if (user.departmentId !== 'all') {
      logs = logs.filter(l => l.departmentId === user.departmentId);
    }
    return { success: true, data: logs };
  }
};
