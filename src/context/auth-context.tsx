'use client';

import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useCallback,
} from 'react';

interface AuthContextType {
  isAdmin: boolean;
  isLoading: boolean;
  login: (password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  isLoading: false,
  login: async () => false,
});

const ADMIN_PASSWORD = 'Mrads@007';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (password: string): Promise<boolean> => {
    setIsLoading(true);
    // In a real app, this would be a more secure check, but for this use case,
    // a simple password comparison is sufficient.
    const success = password === ADMIN_PASSWORD;
    if (success) {
      setIsAdmin(true);
    }
    setIsLoading(false);
    return success;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        isLoading,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};
