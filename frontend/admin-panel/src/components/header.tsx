import styles from "./header.module.scss";
import { PathsEnum, useCurrentRouteName } from "../routes-info";
import { useUserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const TopHeader = () => {
  const { logout, user } = useUserContext();
  const navigate = useNavigate();
  const onLogout = () => {
    logout();
    navigate(PathsEnum.LOGIN);
  };

  return (
    <div className={styles.topHeader}>
      <div>
        <p>Panel administracyjny</p>
      </div>
      <div>
        <p>{user && user.email}</p>
        <button onClick={onLogout}>Wyloguj</button>
      </div>
    </div>
  );
};

const BottomHeader = () => {
  const pageName = useCurrentRouteName();

  return (
    <div className={styles.bottomHeader}>
      <p>{pageName}</p>
    </div>
  );
};

const Header = () => {
  return (
    <div>
      <TopHeader />
      <BottomHeader />
    </div>
  );
};

export default Header;
