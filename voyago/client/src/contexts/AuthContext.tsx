import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { AuthUser } from '../types/travel';
import { useAnalytics } from '../hooks/useAnalytics';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
const FREE_GENERATION_LIMIT = 2;
const FREE_CUSTOMIZATION_LIMIT = 1;

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isPremium: boolean;
  canGenerate: boolean;
  canCustomize: boolean;
  generationsRemaining: number;
  customizationsRemaining: number;
  loginError: string | null;
  login: () => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const gsiInitialized = useRef(false);
  const pendingCallback = useRef<(() => void) | null>(null);
  const { trackLogin } = useAnalytics();

  const isAuthenticated = user !== null;
  const isPremium = user?.subscriptionStatus === 'active' &&
    (user.subscriptionExpiresAt ? new Date(user.subscriptionExpiresAt).getTime() > Date.now() : false);
  const canGenerate = isPremium || (user?.generationsUsed ?? 0) < FREE_GENERATION_LIMIT;
  const canCustomize = isPremium || (user?.customizationsUsed ?? 0) < FREE_CUSTOMIZATION_LIMIT;
  const generationsRemaining = Math.max(0, FREE_GENERATION_LIMIT - (user?.generationsUsed ?? 0));
  const customizationsRemaining = Math.max(0, FREE_CUSTOMIZATION_LIMIT - (user?.customizationsUsed ?? 0));

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  const handleCredentialResponse = useCallback(async (response: { credential: string }) => {
    setLoginError(null);
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ credential: response.credential }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        trackLogin('google');
        if (pendingCallback.current) {
          const cb = pendingCallback.current;
          pendingCallback.current = null;
          setTimeout(cb, 100);
        }
      } else {
        setLoginError('Sign in failed. Please try again.');
      }
    } catch {
      setLoginError('Network error. Please check your connection.');
    }
  }, []);

  const initGSI = useCallback(() => {
    if (gsiInitialized.current || !GOOGLE_CLIENT_ID) return;
    if (typeof google === 'undefined' || !google.accounts?.id) return;

    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
    });
    gsiInitialized.current = true;
  }, [handleCredentialResponse]);

  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  useEffect(() => {
    initGSI();
    const interval = setInterval(initGSI, 500);
    const timeout = setTimeout(() => clearInterval(interval), 5000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [initGSI]);

  const login = useCallback(() => {
    initGSI();
    if (typeof google !== 'undefined' && google.accounts?.id) {
      google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          const btn = document.getElementById('voyago-gsi-btn');
          if (btn) {
            btn.innerHTML = '';
            google.accounts.id.renderButton(btn, {
              theme: 'filled_blue',
              size: 'large',
              text: 'continue_with',
              shape: 'rectangular',
              width: 300,
            });
          }
        }
      });
    }
  }, [initGSI]);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, isLoading, isAuthenticated, isPremium,
      canGenerate, canCustomize,
      generationsRemaining, customizationsRemaining,
      loginError, login, logout, refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
