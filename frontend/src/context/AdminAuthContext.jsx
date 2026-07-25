import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext(null);

const MOCK_ADMIN_USER = {
  id: 'ADM-001',
  name: 'Tejas Mail',
  email: 'tejas.admin@bharatsewa.gov.in',
  role: 'Super Admin',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  permissions: ['all:access', 'users:manage', 'schemes:crud', 'applications:review', 'reports:export', 'settings:edit']
};

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bharat_sewa_admin_user');
    return saved ? JSON.parse(saved) : MOCK_ADMIN_USER;
  });

  const login = (email, password) => {
    // Simulated frontend login validation
    const authenticatedUser = {
      ...MOCK_ADMIN_USER,
      email: email || MOCK_ADMIN_USER.email,
    };
    setUser(authenticatedUser);
    localStorage.setItem('bharat_sewa_admin_user', JSON.stringify(authenticatedUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bharat_sewa_admin_user');
  };

  const hasPermission = (perm) => {
    if (!user) return false;
    if (user.permissions.includes('all:access')) return true;
    return user.permissions.includes(perm);
  };

  return (
    <AdminAuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, hasPermission }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
