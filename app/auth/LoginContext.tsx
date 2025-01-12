import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the types for the context value
interface LoginContextType {
  isLoginComplete: boolean;
  setIsLoginComplete: (isComplete: boolean) => void;
  userId: string | null;
  setUserId: (id: string | null) => void;
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
  const [userId, setUserId] = useState<string | null>(null);

  return (
    <LoginContext.Provider value={{ isLoginComplete, setIsLoginComplete, userId, setUserId }}>
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContext;
