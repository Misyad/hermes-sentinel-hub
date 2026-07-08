// Authentication context and provider

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { AuthState, AuthUser, LoginCredentials } from "@/types/auth";
import * as authService from "@/services/auth";
import * as storage from "@/lib/auth/storage";

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    session: null,
    error: null
  });

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  async function initializeAuth() {
    try {
      const accessToken = storage.getAccessToken();
      const refreshToken = storage.getRefreshToken();
      const expiry = storage.getTokenExpiry();

      if (!accessToken || !refreshToken || !expiry) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      // Check if token is expired
      if (storage.isTokenExpired()) {
        // Try to refresh
        try {
          await refreshSession();
        } catch {
          storage.clearTokens();
          setState(prev => ({ ...prev, isLoading: false }));
        }
        return;
      }

      // Token is valid, fetch current user
      const user = await authService.getCurrentUser();
      setState({
        isAuthenticated: true,
        isLoading: false,
        user,
        session: {
          accessToken,
          refreshToken,
          expiresAt: expiry,
          user
        },
        error: null
      });
    } catch (error) {
      storage.clearTokens();
      setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        session: null,
        error: error instanceof Error ? error.message : "Failed to initialize auth"
      });
    }
  }

  async function login(credentials: LoginCredentials) {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await authService.login(credentials);
      
      // Store tokens
      storage.setTokens(
        response.accessToken,
        response.refreshToken,
        response.expiresIn,
        credentials.rememberMe || false
      );

      const expiresAt = Date.now() + response.expiresIn * 1000;

      setState({
        isAuthenticated: true,
        isLoading: false,
        user: response.user,
        session: {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          expiresAt,
          user: response.user
        },
        error: null
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Login failed"
      }));
      throw error;
    }
  }

  async function logout() {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await authService.logout();
    } catch {
      // Ignore logout errors
    } finally {
      storage.clearTokens();
      setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        session: null,
        error: null
      });
    }
  }

  async function refreshSession() {
    const refreshToken = storage.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await authService.refreshToken(refreshToken);
      const user = await authService.getCurrentUser();
      
      const expiresAt = Date.now() + response.expiresIn * 1000;
      
      storage.setTokens(
        response.accessToken,
        refreshToken,
        response.expiresIn,
        storage.isRememberMeEnabled()
      );

      setState({
        isAuthenticated: true,
        isLoading: false,
        user,
        session: {
          accessToken: response.accessToken,
          refreshToken,
          expiresAt,
          user
        },
        error: null
      });
    } catch (error) {
      storage.clearTokens();
      setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        session: null,
        error: error instanceof Error ? error.message : "Session refresh failed"
      });
      throw error;
    }
  }

  const value: AuthContextValue = {
    ...state,
    login,
    logout,
    refreshSession
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export function useUser(): AuthUser | null {
  const { user } = useAuth();
  return user;
}

export function useSession() {
  const { session } = useAuth();
  return session;
}
