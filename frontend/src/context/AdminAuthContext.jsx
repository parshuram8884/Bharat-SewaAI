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
    const isCompletedLocal = localStorage.getItem(`onboarding_completed_${sbUser.email}`) === 'true';
    return {
      id: sbUser.id,
      name: sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0] || 'Citizen',
      email: sbUser.email,
      role: sbUser.user_metadata?.role || 'Citizen',
      avatar: sbUser.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      hasCompletedOnboarding: isCompletedLocal,
      permissions: ['all:access', 'users:manage', 'schemes:crud', 'applications:review', 'reports:export', 'settings:edit']
    };
  };

  const syncCitizenProfile = async (sbUser) => {
    if (!sbUser || !sbUser.email) return;
    try {
      const { data } = await supabase
        .from('citizen_profiles')
        .select('*')
        .eq('email', sbUser.email)
        .maybeSingle();

      if (data) {
        localStorage.setItem(`onboarding_completed_${sbUser.email}`, 'true');
        setUser((prev) =>
          prev ? {
            ...prev,
            name: data.full_name || prev.name,
            language: data.preferred_language || 'English',
            hasCompletedOnboarding: true
          } : null
        );
      }
    } catch (e) {
      console.warn('Profile sync notice:', e?.message);
    }
  };

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const formatted = formatSupabaseUser(session.user);
        setUser(formatted);
        localStorage.setItem('bharat_sewa_admin_user', JSON.stringify(formatted));
        syncCitizenProfile(session.user);
      }
      setLoadingSession(false);
    }).catch(err => {
      console.error("Supabase getSession error:", err);
      setLoadingSession(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const formatted = formatSupabaseUser(session.user);
        setUser(formatted);
        localStorage.setItem('bharat_sewa_admin_user', JSON.stringify(formatted));
        syncCitizenProfile(session.user);
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

  const updateUserProfile = async ({ name, language }) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      name: name || user.name,
      language: language || user.language || 'English',
      hasCompletedOnboarding: true
    };

    setUser(updatedUser);
    localStorage.setItem('bharat_sewa_admin_user', JSON.stringify(updatedUser));
    if (user.email) {
      localStorage.setItem(`onboarding_completed_${user.email}`, 'true');
    }

    // Save to Supabase database table 'citizen_profiles'
    const profilePayload = {
      email: user.email || 'citizen@bharatsewa.gov.in',
      full_name: name,
      preferred_language: language || 'English'
    };

    const { error } = await supabase
      .from('citizen_profiles')
      .upsert([profilePayload], { onConflict: 'email' });

    if (error) {
      console.warn('Supabase upsert notice, trying direct insert:', error.message);
      const { error: insertErr } = await supabase
        .from('citizen_profiles')
        .insert([profilePayload]);

      if (!insertErr) {
        console.log('✅ Citizen profile saved into Supabase "citizen_profiles"!');
      } else {
        console.warn('Supabase insert notice:', insertErr.message);
      }
    } else {
      console.log('✅ Citizen profile saved into Supabase "citizen_profiles"!');
    }
  };

  return (
    <AdminAuthContext.Provider value={{ user, isAuthenticated: !!user, loadingSession, login, logout, sendMagicLink, updateUserProfile, hasPermission }}>
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

