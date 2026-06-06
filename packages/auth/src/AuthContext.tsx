'use client'

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { tokenStorage } from '@repo/api-client';
import { apiClient, endpoints } from '@repo/api-client';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

interface AuthCtx {
  user: AuthUser | null;
  siteClaims: any[];
  uiComponents: any[];
  isAuthenticated: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  loading: boolean;
  login: (accessToken: string, user: AuthUser) => Promise<void>;
  logout: () => Promise<void>;
  checkUserSession: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [siteClaims, setSiteClaims] = useState<any[]>([]);
  const [uiComponents, setUiComponents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const checkUserSession = useCallback(async () => {
    const token = tokenStorage.getAccess();
    if (!token) { setLoading(false); return; }

    try {
      const [authRes, uiRes] = await Promise.all([
        apiClient.get(endpoints.auth.getMe),
        apiClient.get(endpoints.uiComponents.list),
      ]);
      const { user, siteClaims } = authRes.data;
      const { items: uiComponents } = uiRes.data;
      setUser(user);
      setSiteClaims(siteClaims || []);
      setUiComponents(uiComponents || []);
    } catch {
      tokenStorage.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { checkUserSession(); }, [checkUserSession]);

  const login = useCallback(async (accessToken: string, userData: AuthUser) => {
    tokenStorage.setAccess(accessToken);
    setUser(userData);
    await checkUserSession();
  }, [checkUserSession]);

  const logout = useCallback(async () => {
    try {
      await apiClient.post(endpoints.auth.logout);
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      tokenStorage.clear();
      setUser(null);
      setSiteClaims([]);
      setUiComponents([]);
      window.location.href = '/auth/jwt/sign-in';
    }
  }, []);

  const value = useMemo(() => ({
    user,
    siteClaims,
    uiComponents,
    isAuthenticated: !!user,
    authenticated: !!user,
    unauthenticated: !user && !loading,
    loading,
    login,
    logout,
    checkUserSession,
  }), [user, siteClaims, uiComponents, loading, login, logout, checkUserSession]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
