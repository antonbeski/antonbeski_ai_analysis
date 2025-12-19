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
  createUserWithEmailAndPassword,
  Auth,
} from 'firebase/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,
});

const ADMIN_EMAIL = 'admin@antonbeski.com';
const ADMIN_PASSWORD = 'Mrads@007'; // The admin password

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { auth } = useFirebase();
  const { user, isUserLoading } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    if (isUserLoading || !auth) return;

    const ensureAdminExists = async () => {
      // If a user is already signed in, check if it's the admin
      if (user) {
        if (user.email === ADMIN_EMAIL) {
          setIsAdmin(true);
        } else {
          // If a non-admin user is signed in, this is an unexpected state.
          // For now, we'll treat them as non-admin.
          setIsAdmin(false);
        }
        setIsAuthReady(true);
        return;
      }

      // If no user is signed in, try to sign in as admin.
      try {
        await signInWithEmailAndPassword(auth as Auth, ADMIN_EMAIL, ADMIN_PASSWORD);
        setIsAdmin(true);
      } catch (error: any) {
        // If the admin user doesn't exist, create it.
        if (error.code === 'auth/user-not-found') {
          try {
            await createUserWithEmailAndPassword(auth as Auth, ADMIN_EMAIL, ADMIN_PASSWORD);
            setIsAdmin(true);
          } catch (creationError) {
            console.error('Failed to create admin user:', creationError);
            setIsAdmin(false);
          }
        } else if (error.code === 'auth/wrong-password') {
            // This can happen if the password was changed manually in Firebase Console.
            console.error("Admin password might be incorrect.");
            setIsAdmin(false);
        }
        else {
          // Other sign-in errors
          console.error('Failed to sign in as admin:', error);
          setIsAdmin(false);
        }
      } finally {
        setIsAuthReady(true);
      }
    };

    ensureAdminExists();
  }, [user, isUserLoading, auth]);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAdmin,
        isLoading: !isAuthReady,
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
