import axios from "axios";
import { ENDPOINTS } from "../apiClient";
import { Post } from "../../types/index";


export const PostsService = {
    getAllPosts: async () => {
        try {
          const response = await axios.get<Post[]>(ENDPOINTS.posts, {
            headers: {
              "Content-Type": "application/json",
            },
          });
      
          const postsSortedByDate = response.data.sort((a: Post, b: Post) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          })
        
            return postsSortedByDate as Post[];
        } catch (error) {
          console.error("There has been a problem with request:", error);
        }
      },
      
      deletePost: async (id: string) => {
        try {
          const response = await axios.delete(`${ENDPOINTS.posts}/${id}`);
          return response;
        } catch (error) {
          console.error("There has been a problem with request:", error);
        }
      },
      
      updatePost: async (
        id: string,
        title: string,
        content: string,
        photo?: File
      ) => {
        const formData = new FormData();
      
        const data = {
          title,
          content,
          author: "1",
        };
      
        formData.append("post", JSON.stringify(data));
      
        if (photo) {
          formData.append("file", photo);
        }
      
        try {
          const response = await axios.put(
            `${ENDPOINTS.posts}/update/${id}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          return response;
        } catch (error) {
          console.error("There has been a problem with request:", error);
        }
      },
      
      createPost: async (
        title: string,
        content: string,
        photo?: File
      ) => {
        const formData = new FormData();
      
        const data = {
          title,
          content,
          author: "1",
        };
      
        formData.append("post", JSON.stringify(data));
      
        if (photo) {
          formData.append("file", photo);
        }
      
        try {
          const response = await axios.post(`${ENDPOINTS.posts}/new`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          return response;
        } catch (error) {
          console.error("There has been a problem with request:", error);
        }
      }
}