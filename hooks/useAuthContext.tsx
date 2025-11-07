import { useAuth } from "@clerk/clerk-expo";
import React, { createContext, useContext } from "react";

type AuthContextType = {
  isSignedIn: boolean | undefined;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isSignedIn, signOut } = useAuth();

  return (
    <AuthContext.Provider value={{ isSignedIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuthContext must be used within AuthProvider");
  return context;
};
