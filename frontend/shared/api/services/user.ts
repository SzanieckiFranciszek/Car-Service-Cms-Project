import axios from "axios";
import { TokenData, User } from "../../types/index";
import { ENDPOINTS } from "../apiClient";

export const UserService = {
    getToken: async (email: string, password: string) => {
        const dataToSend = {
          email,
          password,
        };
      
        try {
          const response = await axios.post(`${ENDPOINTS.auth}/login`, dataToSend);
          return response.data as TokenData;
        } catch (error) {
          console.error("There has been a problem with request:", error);
        }
      },
      
      getCurrentUser: async (token: string) => {
        try {
          const response = await axios.get(`${ENDPOINTS.users}/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          return response.data as User;
        } catch (error) {
          console.error("There has been a problem with request:", error);
        }
      },

      signup: async (email: string, password: string, firstName: string, lastName: string ) => {
        const dataToSend = {
          email,
          password,
          firstName,
          lastName
        };

        try {
          const response = await axios.post(`${ENDPOINTS.auth}/signup`, dataToSend);
          return response;
        } catch (error) {
          console.error("There has been a problem with request:", error);
        }
      }
}