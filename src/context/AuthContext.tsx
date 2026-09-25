import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types.ts';
import { api } from '../services/api.ts';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string, role?: UserRole) => Promise<void>;
  loginWithGoogle: (payload?: {
    email?: string;
    name?: string;
    role?: UserRole;
    department?: string;
    credential?: string;
  }) => Promise<User>;
  sendPhoneOtp: (phoneNumber: string) => Promise<{ success: boolean; message: string; otp?: string; phoneNumber: string }>;
  verifyPhoneOtp: (payload: {
    phoneNumber: string;
    otp: string;
    name?: string;
    role?: UserRole;
    department?: string;
  }) => Promise<User>;
  switchRole: (role: UserRole) => Promise<User>;
  loginAsDemo: (role: UserRole) => Promise<void>;
  signup: (name: string, email: string, department?: string, role?: UserRole, phoneNumber?: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (allowedRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await api.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Failed to load session user', err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, password?: string, role?: UserRole) => {
    const loggedInUser = await api.login({ email, password, role });
    setUser(loggedInUser);
  };

  const loginWithGoogle = async (payload?: {
    email?: string;
    name?: string;
    role?: UserRole;
    department?: string;
    credential?: string;
  }) => {
    const loggedInUser = await api.loginWithGoogle(payload || {});
    setUser(loggedInUser);
    return loggedInUser;
  };

  const sendPhoneOtp = async (phoneNumber: string) => {
    return api.sendPhoneOtp(phoneNumber);
  };

  const verifyPhoneOtp = async (payload: {
    phoneNumber: string;
    otp: string;
    name?: string;
    role?: UserRole;
    department?: string;
  }) => {
    const loggedInUser = await api.verifyPhoneOtp(payload);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const switchRole = async (role: UserRole) => {
    const updatedUser = await api.switchRole(role);
    setUser(updatedUser);
    return updatedUser;
  };

  const loginAsDemo = async (role: UserRole) => {
    const loggedInUser = await api.login({ role });
    setUser(loggedInUser);
  };

  const signup = async (name: string, email: string, department?: string, role?: UserRole, phoneNumber?: string) => {
    const newUser = await api.signup({ name, email, department, role, phoneNumber });
    setUser(newUser);
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  const hasRole = (allowedRoles: UserRole[]): boolean => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN') return true;
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithGoogle,
        sendPhoneOtp,
        verifyPhoneOtp,
        switchRole,
        loginAsDemo,
        signup,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
