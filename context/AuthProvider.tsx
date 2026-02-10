"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type AuthUser = {
  email: string | null;
  role: string | null;
};

interface AuthContextType {
  auth: AuthUser;
  setAuth: (auth: AuthUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthUser>({
    email: null,
    role: null,
  });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
