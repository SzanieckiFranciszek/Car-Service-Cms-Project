import axios from "axios";
import { ENDPOINTS } from "../apiClient";
import { Opinion } from "../../types/index";


export const OpinionsService = {
    
getAllOpinions: async () => {
    try {
      const response = await axios.get<Opinion[]>(ENDPOINTS.opinions, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const opinionsSortedByDate = response.data.sort((a: Opinion, b: Opinion) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })
    
        return opinionsSortedByDate as Opinion[];
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
    }
  },
  
  deleteOpinion: async (id: number) => {
    try {
      const response = await axios.delete(`${ENDPOINTS.opinions}/${id}`);
      return response;
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
    }
  },

    createOpinion: async (
    content: string,
    userId: string
  ) => {

    const data = {
      user: {
        id: userId
      },
      content
    };

    try {
      const response = await axios.post(`${ENDPOINTS.opinions}`, data);
      return response;
    } catch (error) {
      console.error("There has been a problem with request:", error);
    }
  }
}