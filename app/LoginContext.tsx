// LoginContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the types for the context value
interface LoginContextType {
  isLoginComplete: boolean;
  setIsLoginComplete: (isComplete: boolean) => void;
}

// Create the context with a default value
const LoginContext = createContext<LoginContextType | undefined>(undefined);

// Custom hook to access the context
export const useLogin = (): LoginContextType => {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error("useLogin must be used within a LoginProvider");
  }
  return context;
};

// LoginProvider component that wraps the app and provides the login state
interface LoginProviderProps {
  children: ReactNode;
}

export const LoginProvider: React.FC<LoginProviderProps> = ({ children }) => {
  const [isLoginComplete, setIsLoginComplete] = useState<boolean>(false);

  return (
    <LoginContext.Provider value={{ isLoginComplete, setIsLoginComplete }}>
      {children}
    </LoginContext.Provider>
  );
};
