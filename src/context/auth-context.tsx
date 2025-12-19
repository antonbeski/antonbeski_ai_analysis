'use client';

import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useContext,
} from 'react';
import { useFirebase, useUser } from '@/firebase';
import {
  signInWithEmailAndPassword,
  signOut,
  Auth,
  signInAnonymously,
} from 'firebase/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAdmin: false,
  login: async () => false,
  logout: async () => {},
  isLoading: true,
});

const ADMIN_EMAIL = 'admin@antonbeski.com';
const ADMIN_PASSWORD = 'Mrads@007'; // The admin password

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { auth } = useFirebase();
  const { user, isUserLoading } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      // Check if the signed-in user is the admin
      setIsAdmin(user.email === ADMIN_EMAIL);
    } else if (!isUserLoading && auth) {
      // If no user is logged in and auth is ready, sign in anonymously
      signInAnonymously(auth as Auth).catch(error => {
        console.error('Anonymous sign-in failed:', error);
      });
    }
  }, [user, isUserLoading, auth]);

  const login = async (password: string) => {
    if (password !== ADMIN_PASSWORD) {
        return false;
    }
    try {
      // Sign out any anonymous user first
      if (user && user.isAnonymous) {
        await signOut(auth as Auth);
      }
      await signInWithEmailAndPassword(auth as Auth, ADMIN_EMAIL, password);
      return true;
    } catch (error: any) {
       // If admin user doesn't exist, this is where you could create it
       if (error.code === 'auth/user-not-found') {
        console.log("Admin user not found, you may need to create it.");
       }
      console.error('Failed to log in:', error);
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth as Auth);
    // After admin logs out, sign back in anonymously
    await signInAnonymously(auth as Auth);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAdmin,
        login,
        logout,
        isLoading: isUserLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// This is the hook that components will use to access the context
export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};
