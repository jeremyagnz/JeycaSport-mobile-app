/**
 * Authentication Context
 * Manages admin authentication state across the app
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Admin, AdminCredentials, AdminSession } from '../models/Admin';
import { loadData, saveData, removeData } from '../services/storage';

const ADMIN_SESSION_KEY = '@admin_session';

// Default admin credentials (in production, this would be validated against a backend)
const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'admin123',
};

interface AuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: AdminCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved session on mount
  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      const session = await loadData<AdminSession>(ADMIN_SESSION_KEY);
      if (session && session.expiresAt > Date.now()) {
        setAdmin(session.admin);
      } else if (session) {
        // Session expired, clean up
        await removeData(ADMIN_SESSION_KEY);
      }
    } catch (error) {
      console.error('Error loading admin session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: AdminCredentials): Promise<boolean> => {
    try {
      // Simple validation (in production, this would be an API call)
      if (
        credentials.username === DEFAULT_ADMIN.username &&
        credentials.password === DEFAULT_ADMIN.password
      ) {
        const adminUser: Admin = {
          id: '1',
          username: credentials.username,
          email: 'admin@jeycasports.com',
        };

        const session: AdminSession = {
          admin: adminUser,
          token: `token_${Date.now()}`,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        };

        await saveData(ADMIN_SESSION_KEY, session);
        setAdmin(adminUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await removeData(ADMIN_SESSION_KEY);
      setAdmin(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated: admin !== null,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
