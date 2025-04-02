import { createContext, useContext } from "react";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userRole: string
}

export interface UserContextType {
  user: User | null;
  token: string;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isReady: boolean;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
