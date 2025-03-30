import axios from 'axios';
import { ENDPOINTS } from "../apiClient";
import { ContactInfo, ContactInfoType, Days, OpenHours } from "../../types/index";

export const ContactInfoService = {

getAllOpenHours: async () => {
    try {
      const response = await axios.get(ENDPOINTS.openingHours, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      return response.data as OpenHours[];
    } catch (error) {
      console.error("There has been a problem with request:", error);
    }
  },
  
  createNewOpeningHours: async (
    dayFrom: Days,
    dayTo: Days,
    timeFrom: string,
    timeTo: string
  ) => {
    const dataToSend = {
      dayFrom,
      dayTo,
      timeFrom,
      timeTo,
    };
  
    try {
      const response = await axios.post(`${ENDPOINTS.openingHours}`, dataToSend, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response;
    } catch (error) {
      console.error("There has been a problem with request:", error);
    }
  },
  
  updateOpeningHours: async (
    id: string,
    dayFrom: Days,
    dayTo: Days,
    timeFrom: string,
    timeTo: string
  ) => {
    const dataToSend = {
      dayFrom,
      dayTo,
      timeFrom,
      timeTo,
    };
  
    try {
      const response = await axios.put(
        `${ENDPOINTS.openingHours}/${id}`,
        dataToSend,
        {
          headers: {
            // 'Content-Type': 'multipart/form-data'
            "Content-Type": "application/json",
          },
        }
      );
      return response;
    } catch (error) {
      console.error("There has been a problem with request:", error);
    }
  },
  
  deleteOpeningHours: async (id: string) => {
    try {
      const response = await axios.delete(`${ENDPOINTS.openingHours}/${id}`);
      return response;
    } catch (error) {
      console.error("There has been a problem with request:", error);
    }
  },
  
  createNewContactInfo: async (
    type: ContactInfoType,
    description: string,
    value: string
  ) => {
    const dataToSend = {
      type,
      description,
      value,
    };
  
    try {
      const response = await axios.post(
        `${ENDPOINTS.contactInfo}/create`,
        dataToSend,
        {
          headers: {
            // 'Content-Type': 'multipart/form-data'
            "Content-Type": "application/json",
          },
        }
      );
      return response;
    } catch (error) {
      console.error("There has been a problem with request:", error);
    }
  },
  
  updateContactInfo: async (
    id: string,
    type: ContactInfoType,
    description: string,
    value: string
  ) => {
    const dataToSend = {
      type,
      description,
      value,
    };
  
    try {
      const response = await axios.put(
        `${ENDPOINTS.contactInfo}/update/${id}`,
        dataToSend,
        {
          headers: {
            // 'Content-Type': 'multipart/form-data'
            "Content-Type": "application/json",
          },
        }
      );
      return response;
    } catch (error) {
      console.error("There has been a problem with request:", error);
    }
  },
  
  deleteContactInfo: async (id: string) => {
    try {
      const response = await axios.delete(`${ENDPOINTS.contactInfo}/${id}`);
      return response;
    } catch (error) {
      console.error("There has been a problem with request:", error);
    }
  },
  
  getAllContantInfo: async () => {
    try {
      const response = await axios.get(ENDPOINTS.contactInfo, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      return response.data as ContactInfo[];
    } catch (error) {
      console.error("There has been a problem with request:", error);
    }
  }

}