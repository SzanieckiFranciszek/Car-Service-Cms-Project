import axios from "axios";
import { User } from "./contexts/UserContext";

export const API_BASE_URL = "http://localhost:8080";

export const ENDPOINTS = {
  opinions: `${API_BASE_URL}/api/opinions`,
  posts: `${API_BASE_URL}/api/posts`,
  contactInfo: `${API_BASE_URL}/api/contact-information`,
  openingHours: `${API_BASE_URL}/api/opening-hours`,
  pages: `${API_BASE_URL}/api/pages`,
  photos: `${API_BASE_URL}/api/photos`,
  sections: `${API_BASE_URL}/api/section`,
  auth: `${API_BASE_URL}/api/auth`,
  users: `${API_BASE_URL}/api/users`,
};

export interface Opinion {
  id: number;
  content: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: Date;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  author: string;
  photo?: string;
}

export enum ContactInfoType {
  PHONE = "phone",
  MAIL = "mail",
}

export const getContactTypeTranslation = (type: string) => {
  switch (type) {
    case ContactInfoType.PHONE:
      return "Telefon";
    case ContactInfoType.MAIL:
      return "Mail";
  }
};

export interface ContactInfo {
  id: string;
  type: ContactInfoType;
  description: string;
  value: string;
}

export enum Days {
  MONDAY = "Poniedziałek",
  TUESDAY = "Wtorek",
  WEDNESDAY = "Środa",
  THURSDAY = "Czwartek",
  FRIDAY = "Piątek",
  SATURDAY = "Sobota",
  SUNDAY = "Niedziela",
}

export interface OpenHours {
  id: string;
  dayFrom: Days;
  dayTo: Days;
  timeFrom: string;
  timeTo: string;
}

export interface Page {
  id: string;
  name: string;
  orderIndex: number;
  isVisible: boolean;
  isHomepage: boolean;
  isRemovable: boolean;
  section?: Section[];
}

export interface Section {
  id: string;
  orderIndex: number;
  isVisible: boolean;
  showInMenu: true;
  content: string;
  title: string;
}

export enum loginStatus {
  OK,
  BAD_CREDENTIALS,
  UNKNOWN,
}

export interface TokenData {
  token: string;
}

export const getToken = async (email: string, password: string) => {
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
};

export const getCurrentUser = async (token: string) => {
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
};

export const changePageOrder = async (id: string, newOrder: number) => {
  try {
    const response = await axios.put(
      `${ENDPOINTS.pages}/${id}/neworder/${newOrder}`
    );
    return response;
  } catch (error) {
    console.error("There has been a problem with request:", error);
  }
};

export const createNewPage = async (name: string, orderIndex: number) => {
  const dataToSend = {
    name,
    orderIndex,
    isVisible: true,
    isHomepage: false,
    isRemovable: true,
    isGallery: false,
  };

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
};

export const changeSectionOrder = async (id: string, newOrder: number) => {
  try {
    const response = await axios.put(
      `${ENDPOINTS.sections}/${id}/neworder/${newOrder}`
    );
    return response;
  } catch (error) {
    console.error("There has been a problem with request:", error);
  }
};

export const createNewSection = async (
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
};

export const deleteSection = async (id: string) => {
  try {
    const response = await axios.delete(`${ENDPOINTS.sections}/${id}`);
    return response;
  } catch (error) {
    console.error("There has been a problem with request:", error);
  }
};

export const getAllPageSections = async (id: string) => {
  try {
    const response = await axios.get(`${ENDPOINTS.pages}/${id}`, {
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
};

export const getAllPagesWithSections = async () => {
  try {
    const response = await axios.get(`${ENDPOINTS.pages}/section`, {
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
};

export const deletePage = async (id: string) => {
  try {
    const response = await axios.delete(`${ENDPOINTS.pages}/${id}`);
    return response;
  } catch (error) {
    console.error("There has been a problem with request:", error);
  }
};

export const updatePage = async (
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
};

export const updateSection = async (
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
};

export const getAllOpenHours = async () => {
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
};

export const createNewOpeningHours = async (
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
};

export const updateOpeningHours = async (
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
};

export const deleteOpeningHours = async (id: string) => {
  try {
    const response = await axios.delete(`${ENDPOINTS.openingHours}/${id}`);
    return response;
  } catch (error) {
    console.error("There has been a problem with request:", error);
  }
};

export const createNewContactInfo = async (
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
};

export const updateContactInfo = async (
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
};

export const deleteContactInfo = async (id: string) => {
  try {
    const response = await axios.delete(`${ENDPOINTS.contactInfo}/${id}`);
    return response;
  } catch (error) {
    console.error("There has been a problem with request:", error);
  }
};

export const getAllContantInfo = async () => {
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
};

export const getAllOpinions = async () => {
  try {
    const response = await axios.get(ENDPOINTS.opinions, {
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
};

export const deleteOpinion = async (id: number) => {
  try {
    const response = await axios.delete(`${ENDPOINTS.opinions}/${id}`);
    return response;
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
};

export const getAllPosts = async () => {
  try {
    const response = await axios.get(ENDPOINTS.posts, {
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
};

export const deletePost = async (id: string) => {
  try {
    const response = await axios.delete(`${ENDPOINTS.posts}/${id}`);
    return response;
  } catch (error) {
    console.error("There has been a problem with request:", error);
  }
};

export const updatePost = async (
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
};

export const createPost = async (
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
};

export const getHomepageImage = async () => {
  try {
    const response = await axios.get(`${ENDPOINTS.photos}/homepage`, {
      responseType: "blob",
    });

    return response.data;
  } catch (error) {
    console.error("There has been a problem with request:", error);
  }
};

export const uploadHomepageImage = async (file: File) => {
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
};

export const changeHomepageImage = async (file: File) => {
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
};

export const uploadPhotos = async (files: FileList) => {
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
};

export interface Photo {
  id: string;
  url: string;
}

export const getAllPhotos = async () => {
  try {
    const response = await axios.get(`${ENDPOINTS.photos}`);
    const photosInfo = response.data;
    const downloadedPhotos: Photo[] = [];

    for (const photoInfo of photosInfo) {
      const responseFromDownload = await axios.get(
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
};

export const deletePhoto = async (id: string) => {
  try {
    const response = await axios.delete(`${ENDPOINTS.photos}/${id}`);
    return response;
  } catch (error) {
    console.error("There has been a problem with request:", error);
  }
};
