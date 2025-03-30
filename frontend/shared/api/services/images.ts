import axios from "axios";
import { ENDPOINTS } from "../apiClient";
import { Photo } from "../../types/index";


export const ImagesService = {
    
getHomepageImage: async () => {
    try {
      const response = await axios.get<Blob>(`${ENDPOINTS.photos}/homepage`, {
        responseType: "blob",
      });
  
      return response.data;
    } catch (error) {
      console.error("There has been a problem with request:", error);
    }
  },
  
  uploadHomepageImage: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await axios.post(
        `${ENDPOINTS.photos}/homepage`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      return response.data;
    } catch (error) {
      console.error("There has been a problem with request:", error);
    }
  },
  
  changeHomepageImage: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await axios.put(
        `${ENDPOINTS.photos}/replace/homepage`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      return response.data;
    } catch (error) {
      console.error("There has been a problem with request:", error);
    }
  },
  
  uploadPhotos: async (files: FileList) => {
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("orderIndex", "0");
  
        await axios.post(`${ENDPOINTS.photos}/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
    } catch (error) {
      console.error("There has been a problem with request:", error);
    }
  },
  

  
  getAllPhotos: async () => {
    try {
      const response = await axios.get<Photo[]>(`${ENDPOINTS.photos}`);
      const photosInfo = response.data;
      const downloadedPhotos: Photo[] = [];
  
      for (const photoInfo of photosInfo) {
        const responseFromDownload = await axios.get<Blob>(
          `${ENDPOINTS.photos}/download/${photoInfo.id}`,
          {
            responseType: "blob",
          }
        );
        const url = URL.createObjectURL(responseFromDownload.data);
        downloadedPhotos.push({
          id: photoInfo.id,
          url: url,
        });
      }
  
      return downloadedPhotos;
    } catch (error) {
      console.error("There has been a problem with request:", error);
    }
  },
  
  deletePhoto: async (id: string) => {
    try {
      const response = await axios.delete(`${ENDPOINTS.photos}/${id}`);
      return response;
    } catch (error) {
      console.error("There has been a problem with request:", error);
    }
  }
}