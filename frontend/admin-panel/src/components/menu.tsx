import { getRouteName, PathsEnum } from "../routes-info";
import styles from "./menu.module.scss";
import { NavLink } from "react-router-dom";

interface NavButtonProps {
  path: string;
}

const NavButton = (props: NavButtonProps) => {
  const displayName = getRouteName(props.path);

  return (
    <NavLink
      to={props.path}
      className={({ isActive }) =>
        isActive ? `${styles.navButton} ${styles.active}` : styles.navButton
      }
    >
      {displayName}
    </NavLink>
  );
};

const Menu = () => {
  return (
    <div className={styles.menu}>
      <div className={styles.logoWrapper}>
        <p>MotoSpoko</p>
      </div>

      <nav>
        <NavButton path={PathsEnum.HOME} />
        <NavButton path={PathsEnum.PAGES} />
        <NavButton path={PathsEnum.POSTS} />
        <NavButton path={PathsEnum.OPINIONS} />
        <NavButton path={PathsEnum.GALLERY} />
      </nav>
    </div>
  );
};

export default Menu;
