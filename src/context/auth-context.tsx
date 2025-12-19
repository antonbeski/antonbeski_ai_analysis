'use client';

import React, { createContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const correctPassword = 'Mrads@007';

  const login = (password: string) => {
    if (password === correctPassword) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login }}>
      {children}
    </AuthContext.Provider>
  );
};
