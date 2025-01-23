import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export enum PathsEnum {
    LOGIN = '/login',
    POSTS = '/dashboard/posts',
    PAGES = '/dashboard/pages',
    OPINIONS = '/dashboard/opinions',
    GALLERY = '/dashboard/gallery',
    HOME = '/dashboard/home'
  }

export const getRouteName = (pathname: string) => {
    switch (pathname) {
      case PathsEnum.POSTS: {
        return 'Posty'
      }
      case PathsEnum.PAGES: {
        return 'Podstrony'
      }
      case PathsEnum.OPINIONS: {
        return 'Opinie'
      }
      case PathsEnum.GALLERY: {
        return 'Galeria'
      }
      case PathsEnum.HOME: {
        return 'Strona główna'
      }
    }
  }

export const useCurrentRouteName = () => {
    const location = useLocation();
    const [routeName, setPageName] = useState<string | null>(null)

    useEffect(() => {
        const name = getRouteName(location.pathname)
        if(name) {
            setPageName(name)
        }
    },[location])

    return routeName
}