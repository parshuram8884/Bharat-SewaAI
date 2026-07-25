import { Roles, RolePermissions, Permissions } from '../data/officerPermissionModel';
import { InternalStatus } from '../data/officerWorkflowTransitions';

export const permissionService = {
  hasPermission(user, permission) {
    if (!user || !user.role) return false;
    const permissions = RolePermissions[user.role] || [];
    return permissions.includes(permission);
  },

  hasAnyPermission(user, permissionsArray) {
    if (!user || !user.role) return false;
    const userPermissions = RolePermissions[user.role] || [];
    return permissionsArray.some(p => userPermissions.includes(p));
  },

  hasAllPermissions(user, permissionsArray) {
    if (!user || !user.role) return false;
    const userPermissions = RolePermissions[user.role] || [];
    return permissionsArray.every(p => userPermissions.includes(p));
  },

  canAccessDepartment(user, departmentId) {
    if (!user) return false;
    if (user.role === Roles.SUPER_ADMIN) return true;
    return user.departmentId === departmentId;
  },

  canReviewApplication(user, application) {
    if (!user || !application) return false;
    if (!this.hasPermission(user, Permissions.APPLICATION_REVIEW)) return false;
    if (!this.canAccessDepartment(user, application.departmentId)) return false;
    
    // Admins and Senior Reviewers can review anything in their dept
    if (user.role === Roles.SENIOR_REVIEWER || user.role === Roles.DEPARTMENT_ADMIN) {
      return true;
    }
    
    // Normal reviewers must be assigned to it
    return application.assignedOfficerId === user.id;
  },

  canMakeDecision(user, application) {
    if (!user || !application) return false;
    if (!this.canReviewApplication(user, application)) return false;
    return this.hasAnyPermission(user, [
      Permissions.APPLICATION_RECOMMEND,
      Permissions.APPLICATION_APPROVE,
      Permissions.APPLICATION_REJECT
    ]);
  },

  canAssignApplication(user, application) {
    if (!user || !application) return false;
    if (!this.canAccessDepartment(user, application.departmentId)) return false;
    return this.hasPermission(user, Permissions.APPLICATION_ASSIGN);
  },

  isTerminalState(internalStatus) {
    return [
      InternalStatus.APPROVED,
      InternalStatus.REJECTED,
      InternalStatus.CLOSED,
      'withdrawn', // citizen status
      'cancelled', // citizen status
      'appeal-resolved'
    ].includes(internalStatus);
  },

  // Grievance Permissions
  canViewGrievance(user, grievance) {
    if (!user || !grievance) return false;
    if (user.role === Roles.CITIZEN) return grievance.citizenId === user.id;
    if (user.role === Roles.SUPER_ADMIN) return true;
    if (!this.canAccessDepartment(user, grievance.departmentId)) return false;
    if (this.hasPermission(user, Permissions.GRIEVANCE_VIEW_DEPARTMENT)) return true;
    return grievance.assignedOfficerId === user.id || this.hasPermission(user, Permissions.GRIEVANCE_VIEW);
  },

  canReviewGrievance(user, grievance) {
    if (!user || !grievance) return false;
    if (!this.hasPermission(user, Permissions.GRIEVANCE_REVIEW)) return false;
    if (user.role === Roles.SUPER_ADMIN) return true;
    if (!this.canAccessDepartment(user, grievance.departmentId)) return false;
    if (user.role === Roles.GRIEVANCE_MANAGER || user.role === Roles.DEPARTMENT_ADMIN) return true;
    return grievance.assignedOfficerId === user.id;
  },

  canAssignGrievance(user, grievance) {
    if (!user || !grievance) return false;
    if (!this.canAccessDepartment(user, grievance.departmentId)) return false;
    return this.hasPermission(user, Permissions.GRIEVANCE_ASSIGN);
  },

  canResolveGrievance(user, grievance) {
    if (!user || !grievance) return false;
    if (!this.canReviewGrievance(user, grievance)) return false;
    return this.hasPermission(user, Permissions.GRIEVANCE_RESOLVE);
  },

  canEscalateGrievance(user, grievance) {
    if (!user || !grievance) return false;
    if (user.role === Roles.CITIZEN) return grievance.citizenId === user.id;
    return this.canReviewGrievance(user, grievance) && this.hasPermission(user, Permissions.GRIEVANCE_ESCALATE);
  },

  canReopenGrievance(user, grievance) {
    if (!user || !grievance) return false;
    if (user.role === Roles.CITIZEN) return grievance.citizenId === user.id;
    return this.canAccessDepartment(user, grievance.departmentId) && this.hasPermission(user, Permissions.GRIEVANCE_REOPEN);
  },

  canReviewAppeal(user, grievance) {
    if (!user || !grievance) return false;
    if (!this.canAccessDepartment(user, grievance.departmentId)) return false;
    return this.hasPermission(user, Permissions.GRIEVANCE_APPEAL_REVIEW);
  },

  canManageGrievanceConfig(user) {
    if (!user) return false;
    return this.hasPermission(user, Permissions.GRIEVANCE_CONFIG_MANAGE) || this.hasPermission(user, Permissions.GRIEVANCE_SLA_MANAGE) || this.hasPermission(user, Permissions.GRIEVANCE_CATEGORY_MANAGE);
  }
};
