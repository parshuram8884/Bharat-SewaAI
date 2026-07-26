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
    return saved ? JSON.parse(saved) : null;
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
        .limit(1);

      if (data && data.length > 0) {
        const profile = data[0];
        localStorage.setItem(`onboarding_completed_${sbUser.email}`, 'true');
        setUser((prev) =>
          prev ? {
            ...prev,
            name: profile.full_name || prev.name,
            language: profile.preferred_language || 'English',
            hasCompletedOnboarding: true
          } : null
        );
      }
    } catch (e) {
      console.warn('Profile sync notice:', e?.message);
    }
  };

  useEffect(() => {
    // Helper to handle session and login user
    const handleUserSession = (sessionUser) => {
      if (sessionUser) {
        const formatted = formatSupabaseUser(sessionUser);
        setUser(formatted);
        localStorage.setItem('bharat_sewa_admin_user', JSON.stringify(formatted));
        syncCitizenProfile(sessionUser);
      }
    };

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        handleUserSession(session.user);
      } else {
        // If there's an email link token in the URL hash, handle magic link callback
        const hash = window.location.hash;
        const search = window.location.search;
        if (hash.includes('access_token') || hash.includes('type=magiclink') || hash.includes('type=recovery') || search.includes('code=')) {
          // Auto login backup for email link redirection
          const tempEmail = localStorage.getItem('bharat_sewa_magic_email') || 'citizen@bharatsewa.gov.in';
          login(tempEmail);
        }
      }
      setLoadingSession(false);
    }).catch(err => {
      console.error("Supabase getSession error:", err);
      setLoadingSession(false);
    });

    // Listen for auth changes (Triggers automatically when clicking email magic link)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        handleUserSession(session.user);
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (window.location.pathname === '/login' || window.location.pathname === '/') {
            window.location.href = '/dashboard';
          }
        }
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
    const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
    const redirectTo = `${siteUrl}/dashboard`;
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });
    if (error) throw error;
    return data;
  };

  const login = (email) => {
    const isCompletedLocal = localStorage.getItem(`onboarding_completed_${email}`) === 'true';
    const authenticatedUser = {
      id: `CIT-${Date.now().toString().slice(-4)}`,
      name: email?.split('@')[0] || 'Citizen',
      email: email || 'citizen@bharatsewa.gov.in',
      role: 'Citizen',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      hasCompletedOnboarding: isCompletedLocal,
      permissions: ['all:access', 'users:manage', 'schemes:crud', 'applications:review', 'reports:export', 'settings:edit']
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

    // Save to Supabase database table 'citizen_profiles' (Check first to avoid duplicate emails)
    const profilePayload = {
      email: user.email || 'citizen@bharatsewa.gov.in',
      full_name: name,
      preferred_language: language || 'English'
    };

    try {
      const { data: existing } = await supabase
        .from('citizen_profiles')
        .select('id')
        .eq('email', profilePayload.email);

      if (existing && existing.length > 0) {
        // Update existing entry instead of adding duplicate
        await supabase
          .from('citizen_profiles')
          .update({
            full_name: profilePayload.full_name,
            preferred_language: profilePayload.preferred_language
          })
          .eq('email', profilePayload.email);
        console.log('✅ Updated existing citizen profile in Supabase table "citizen_profiles"!');
      } else {
        // Insert new entry
        await supabase
          .from('citizen_profiles')
          .insert([profilePayload]);
        console.log('✅ Saved new citizen profile into Supabase table "citizen_profiles"!');
      }
    } catch (err) {
      console.warn('Supabase profile save notice:', err?.message);
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

