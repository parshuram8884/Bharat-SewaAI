import React from 'react';
import { Navigate } from 'react-router-dom';
import { permissionService } from '../../services/permissionService';
import { officerAuthService } from '../../services/officerAuthService';

const PermissionGuard = ({ children, requiredPermissions = [], requireAuth = true }) => {
  const user = officerAuthService.getCurrentUser();

  if (requireAuth && !user) {
    return <Navigate to="/officer/login" replace />;
  }

  if (user && requiredPermissions.length > 0) {
    const hasAccess = permissionService.hasAllPermissions(user, requiredPermissions);
    if (!hasAccess) {
      return (
        <div className="p-8 text-center max-w-lg mx-auto mt-20 bg-red-50 text-red-800 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p>You do not have the required permissions to view this page.</p>
        </div>
      );
    }
  }

  return children;
};

export default PermissionGuard;
