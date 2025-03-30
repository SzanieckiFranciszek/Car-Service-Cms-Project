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
    isGallery: boolean;
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


  export interface Photo {
    id: string;
    url: string;
  }


  export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    userRole: string
  }