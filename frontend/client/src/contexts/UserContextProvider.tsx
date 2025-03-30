import React, { ReactNode, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { UserService } from "@shared/api/services";
// import axios from "axios";
import { User } from "@shared/types";

interface UserProviderProps {
  children: ReactNode;
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>("");
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const authOnAppStart = async () => {
      const tokenFromLocalStorage = localStorage.getItem("token");
      if (tokenFromLocalStorage) {
        const userData = await UserService.getCurrentUser(tokenFromLocalStorage);
        if (userData) {
          setUser(userData);
          setToken(tokenFromLocalStorage);
          // axios.defaults.headers.common["Authorization"] =
          //   "Bearer " + tokenFromLocalStorage;
        }
      }
      setIsReady(true);
    };

    authOnAppStart();
  }, []);

  const login = async (email: string, password: string) => {
    const tokenData = await UserService.getToken(email, password);
    if (tokenData) {
      const userData = await UserService.getCurrentUser(tokenData.token);
      if (userData) {
        setUser(userData);
        setToken(tokenData.token);
        localStorage.setItem("token", tokenData.token);

        // axios.defaults.headers.common["Authorization"] =
        //   "Bearer " + tokenData.token;
        setIsReady(true);
        return true;
      }
    }
    setIsReady(true);
    return false;
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    const response = await UserService.signup(email, password, firstName, lastName)
    if(response?.status === 200) {
      login(email, password)
      return true;

    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    setIsReady(false);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, register, token, isReady }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
