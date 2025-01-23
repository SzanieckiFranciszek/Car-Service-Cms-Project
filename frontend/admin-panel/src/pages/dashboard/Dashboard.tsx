import { Outlet, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import Menu from "../../components/menu";
import styles from "./dashboard.module.scss";
import { useUserContext } from "../../contexts/UserContext";
import axios from "axios";

const useAxiosInterceptorsLogout = () => {
  const { logout } = useUserContext();
  const navigate = useNavigate();

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        (error.response.status === 403 || error.response.status === 401) &&
        !originalRequest._retry
      ) {
        logout();
        navigate("/login");
      }

      return Promise.reject(error);
    }
  );
};

const Dashboard = () => {
  useAxiosInterceptorsLogout();

  return (
    <div className={styles.dashboard}>
      <div className={styles.left}>
        <Menu />
      </div>
      <div className={styles.right}>
        <Header />
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
