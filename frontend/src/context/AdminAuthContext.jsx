import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

const AdminAuthContext = createContext(null);

const MOCK_ADMIN_USER = {
  id: 'CIT-001',
  name: 'Citizen User',
  email: 'citizen@bharatsewa.gov.in',
  role: 'Citizen',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  permissions: ['all:access', 'users:manage', 'schemes:crud', 'applications:review', 'reports:export', 'settings:edit']
};

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bharat_sewa_admin_user');
    return saved ? JSON.parse(saved) : MOCK_ADMIN_USER;
  });
  const [loadingSession, setLoadingSession] = useState(true);

  const formatSupabaseUser = (sbUser) => {
    if (!sbUser) return null;
    return {
      id: sbUser.id,
      name: sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0] || 'Citizen',
      email: sbUser.email,
      role: sbUser.user_metadata?.role || 'Citizen',
      avatar: sbUser.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      permissions: ['all:access', 'users:manage', 'schemes:crud', 'applications:review', 'reports:export', 'settings:edit']
    };
  };

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const formatted = formatSupabaseUser(session.user);
        setUser(formatted);
        localStorage.setItem('bharat_sewa_admin_user', JSON.stringify(formatted));
      }
      setLoadingSession(false);
    }).catch(err => {
      console.error("Supabase getSession error:", err);
      setLoadingSession(false);
    });

    // Listen for auth changes (e.g. when coming back from verification magic link)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const formatted = formatSupabaseUser(session.user);
        setUser(formatted);
        localStorage.setItem('bharat_sewa_admin_user', JSON.stringify(formatted));
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('bharat_sewa_admin_user');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const sendMagicLink = async (email) => {
    const redirectTo = `${window.location.origin}/dashboard`;
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });
    if (error) throw error;
    return data;
  };

  const login = (email, password) => {
    const authenticatedUser = {
      ...MOCK_ADMIN_USER,
      email: email || MOCK_ADMIN_USER.email,
    };
    setUser(authenticatedUser);
    localStorage.setItem('bharat_sewa_admin_user', JSON.stringify(authenticatedUser));
    return { success: true };
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error("Signout error:", e);
    }
    setUser(null);
    localStorage.removeItem('bharat_sewa_admin_user');
  };

  const hasPermission = (perm) => {
    if (!user) return false;
    if (user.permissions.includes('all:access')) return true;
    return user.permissions.includes(perm);
  };

  return (
    <AdminAuthContext.Provider value={{ user, isAuthenticated: !!user, loadingSession, login, logout, sendMagicLink, hasPermission }}>
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

