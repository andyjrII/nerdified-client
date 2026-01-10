"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  auth: {
    email: string | null;
    accessToken: string | null;
  };
  setAuth: (auth: { email: string | null; accessToken: string | null }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<{
    email: string | null;
    accessToken: string | null;
  }>({ email: null, accessToken: null });

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
