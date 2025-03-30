import axios from 'axios'
import { ENDPOINTS } from '../apiClient';
import { Page, Section } from '../../types/index';



export const PageService = {
    changePageOrder: async (id: string, newOrder: number) => {
        try {
          const response = await axios.put(
            `${ENDPOINTS.pages}/${id}/neworder/${newOrder}`
          );
          return response;
        } catch (error) {
          console.error("There has been a problem with request:", error);
        }
      },
      createNewPage:  async (name: string, orderIndex: number) => {
        const dataToSend = {
          name,
          orderIndex,
          isVisible: true,
          isHomepage: false,
          isRemovable: true,
          isGallery: false,
        }

        try {
          const response = await axios.post(`${ENDPOINTS.pages}/create`, dataToSend, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          return response;
        } catch (error) {
          console.error("There has been a problem with request:", error);
        }
      },
      
      changeSectionOrder: async (id: string, newOrder: number) => {
        try {
          const response = await axios.put(
            `${ENDPOINTS.sections}/${id}/neworder/${newOrder}`
          );
          return response;
        } catch (error) {
          console.error("There has been a problem with request:", error);
        }
      },
      createNewSection: async (
        title: string,
        orderIndex: number,
        content: string,
        pageId: string,
        showInMenu: boolean
      ) => {
        const dataToSend = {
          title,
          orderIndex,
          content,
          isVisible: true,
          showInMenu,
          pageId,
        };
      
        try {
          const response = await axios.post(
            `${ENDPOINTS.sections}/create`,
            dataToSend,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          return response;
        } catch (error) {
          console.error("There has been a problem with request:", error);
        }
      },
      deleteSection: async (id: string) => {
        try {
          const response = await axios.delete(`${ENDPOINTS.sections}/${id}`);
          return response;
        } catch (error) {
          console.error("There has been a problem with request:", error);
        }
      },
      
      getAllPageSections: async (id: string) => {
        try {
          const response = await axios.get<{section: Section[]}>(`${ENDPOINTS.pages}/${id}`, {
            headers: {
              "Content-Type": "application/json",
            },
          });
      
          const sections = response.data.section;
          const dataSorted: Section[] = sections.sort(
            (a: Section, b: Section) => a.orderIndex - b.orderIndex
          );
          return dataSorted;
        } catch (error) {
          console.error("There has been a problem with request:", error);
        }
      },
      
      getAllPagesWithSections: async () => {
        try {
          const response = await axios.get<Page[]>(`${ENDPOINTS.pages}/section`, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          const dataSorted: Page[] = response.data.sort(
            (a: Page, b: Page) => a.orderIndex - b.orderIndex
          );
          return dataSorted;
        } catch (error) {
          console.error("There has been a problem with request:", error);
        }
      },

      getAllVisiblePagesWithSections: async () => {
          try {
            const response = await axios.get<Page[]>(`${ENDPOINTS.pages}/visible/section`, {
              headers: {
                "Content-Type": "application/json",
              },
            });
            const dataSorted: Page[] = response.data.sort(
              (a: Page, b: Page) => a.orderIndex - b.orderIndex
            );
            return dataSorted;
          } catch (error) {
            console.error("There has been a problem with request:", error);
          }
        },
      
      deletePage: async (id: string) => {
        try {
          const response = await axios.delete(`${ENDPOINTS.pages}/${id}`);
          return response;
        } catch (error) {
          console.error("There has been a problem with request:", error);
        }
      },
      
      updatePage: async (
        id: string,
        name: string,
        isVisible: boolean
      ) => {
        const dataToSend = {
          name,
          isVisible,
        };
      
        try {
          const response = await axios.put(
            `${ENDPOINTS.pages}/update/${id}`,
            dataToSend,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          return response;
        } catch (error) {
          console.error("There has been a problem with request:", error);
        }
      },
      
      updateSection: async (
        id: string,
        title: string,
        isVisible: boolean,
        content: string,
        showInMenu: boolean
      ) => {
        const dataToSend = {
          title,
          isVisible,
          content,
          showInMenu,
        };
      
        try {
          const response = await axios.put(
            `${ENDPOINTS.sections}/update/${id}`,
            dataToSend,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          return response;
        } catch (error) {
          console.error("There has been a problem with request:", error);
        }
      }
  };




  
  
  

  
  