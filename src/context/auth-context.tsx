'use client';

import React, { createContext, useState, ReactNode, useEffect, useContext } from 'react';
import { useAuth, useFirebase, useUser } from '@/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { Auth } from 'firebase/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAdmin: false,
  login: async () => false,
  logout: async () => {},
  isLoading: true,
});

const ADMIN_EMAIL = 'admin@antonbeski.com';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { auth } = useFirebase();
  const { user, isUserLoading } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      setIsAdmin(user.email === ADMIN_EMAIL);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const login = async (password: string) => {
    try {
      await signInWithEmailAndPassword(auth as Auth, ADMIN_EMAIL, password);
      return true;
    } catch (error) {
      console.error('Failed to log in:', error);
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth as Auth);
  };
  
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout, isLoading: isUserLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
