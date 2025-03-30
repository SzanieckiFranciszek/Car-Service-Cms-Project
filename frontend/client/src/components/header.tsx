import styles from "./header.module.scss";
import { useUserContext } from "../contexts/UserContext";
import { NavLink } from "react-router-dom";
import { HashLink } from 'react-router-hash-link'
import { useState } from "react";
import Modal from "./modal";
import { Page } from "@shared/types";

interface NavButtonProps {
  page: Page
}

// const NavButton = ({page}: NavButtonProps) => {

//   return (
//     <NavLink
//       to={`/${page.name}`}
//       className={({ isActive }) =>
//         isActive ? `${styles.navButton} ${styles.active}` : styles.navButton
//       }
//     >
//       {page.name}
//     </NavLink>
//   );
// };



interface NavButtonProps {
  page: Page;
}

const NavButton = ({ page}: NavButtonProps) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const visibleSections = page.section && page.section.filter(section => section.isVisible && section.showInMenu);

  return (
    <div
      className={styles.navButtonContainer}
      onMouseEnter={() => setDropdownVisible(true)}
      onMouseLeave={() => setDropdownVisible(false)}
    >
      <NavLink
        to={`/${page.name}`}
        className={({ isActive }) =>
          isActive ? `${styles.navButton} ${styles.active}` : styles.navButton
        }
      >
        {page.name}
      </NavLink>
      {visibleSections && isDropdownVisible && (
        <div onClick={() => setDropdownVisible(false)} className={styles.dropdown}>
          {visibleSections.map(section => (
            <HashLink
              key={section.id}
              to={`/${page.name}#section-${section.id}`}
              className={styles.dropdownItem}
            >
            {section.title}
            </HashLink>
          ))}
        </div>
      )}
    </div>
  );
};


interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterModalOpen: () => void;
  onLogin: (email: string, password: string) => Promise<boolean>
}

interface Errors {
  [key: string]: string;
}

const LoginModal = (props: LoginModalProps) => {

  const [errors, setErrors] = useState<Errors>({});
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
  
    // const { login } = useUserContext();
  
    const validateForm = () => {
      let formIsValid = true;
      const errors: Errors = {};
  
      if (!email) {
        formIsValid = false;
        errors["username"] = "Proszę wprowadzic nazwę użytkownika.";
      }
  
      if (!password) {
        formIsValid = false;
        errors["password"] = "Podaj hasło.";
      }
  
      setErrors(errors);
      return formIsValid;
    };
  
    const onLogin = async () => {
      if (validateForm()) {
        if (await props.onLogin(email, password)) {
          props.onClose()
        } else {
          setErrors({ other: "Nieprawidłowe dane logowania" });
        }
      }
    };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
        <div className={styles.loginBoxContent}>
          <div className={styles.loginBoxForm}>
            <div className={styles.loginBoxFormInputWapper}>
              <label htmlFor="username">Login</label>
              <input
                required
                id="username"
                name="username"
                type="text"
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.username && (
                <p className={styles.inputAlert}>{errors.username}</p>
              )}
            </div>
            <div className={styles.loginBoxFormInputWapper}>
              <label htmlFor="password">Hasło</label>
              <input
                required
                id="password"
                name="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <p className={styles.inputAlert}>{errors.password}</p>
              )}
              {errors.other && (
                <p className={styles.inputAlert}>{errors.other}</p>
              )}
              {errors.credentials && (
                <p className={styles.inputAlert}>{errors.credentials}</p>
              )}
            </div>
            <button onClick={onLogin}>Zaloguj</button>
          </div>
          <div className={styles.redirect}>
            <p>Nie masz jeszcze konta?</p>
            <button onClick={props.onRegisterModalOpen}>Zarejestruj się</button>
          </div>
        </div>
    </Modal>
  );
};

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  onLoginModalOpen: () => void;
}

const RegisterModal = (props: RegisterModalProps) => {

  const [errors, setErrors] = useState<Errors>({});
    const [email, setEmail] = useState<string>("");
    const [firstname, setFirstname] = useState<string>("");
    const [lastname, setLastname] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [secondPassword, setSecondPassword] = useState<string>("");

  
    // const { login } = useUserContext();
  
    const validateForm = () => {
      let formIsValid = true;
      const errors: Errors = {};
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/;

  
      if (!email) {
        formIsValid = false;
        errors["username"] = "Proszę wprowadzić e-mail.";
      }
      else if (!emailRegex.test(email)) {
        formIsValid = false;
        errors["username"] = "Podaj poprawny adres e-mail.";
      }

      if (!firstname) {
        formIsValid = false;
        errors["firstname"] = "Proszę wprowadzic imię.";
      }

      if (!lastname) {
        formIsValid = false;
        errors["lastname"] = "Proszę wprowadzic nazwisko.";
      }

      
      if (!password) {
        formIsValid = false;
        errors["password"] = "Podaj hasło.";
      }
      else if (!passwordRegex.test(password)) {
        formIsValid = false;
        errors["password"] = "Hasło musi zawierać co najmniej jedną dużą literę, jeden znak specjalny i jedną cyfrę.";
      }
      
      if(password !== secondPassword) {
        formIsValid = false;
        errors["secondPassword"] = "Hasła się nie zgadzają.";
      }
  
      setErrors(errors);
      return formIsValid;
    };
  
    const onRegister = async () => {
      if (validateForm()) {
        if (await props.onRegister(email,password,firstname,lastname)) {
          props.onClose()
        } else {
          setErrors({ other: "Coś poszło nie tak" });
        }
      }
    };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
        <div className={styles.loginBoxContent}>
          <h3 className={styles.registerHeader}>Rejestracja konta</h3>
          <div className={styles.loginBoxForm}>
            <div className={styles.loginBoxFormInputWapper}>
              <label>Adres email</label>
              <input
                type="text"
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.username && (
                <p className={styles.inputAlert}>{errors.username}</p>
              )}
            </div>
            <div className={styles.loginBoxFormInputWapper}>
              <label>Imię</label>
              <input
                type="text"
                onChange={(e) => setFirstname(e.target.value)}
              />
              {errors.firstname && (
                <p className={styles.inputAlert}>{errors.firstname}</p>
              )}
            </div>
            <div className={styles.loginBoxFormInputWapper}>
              <label>Nazwisko</label>
              <input
                type="text"
                onChange={(e) => setLastname(e.target.value)}
              />
              {errors.lastname && (
                <p className={styles.inputAlert}>{errors.lastname}</p>
              )}
            </div>
            <div className={styles.loginBoxFormInputWapper}>
              <label>Hasło</label>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <p className={styles.inputAlert}>{errors.password}</p>
              )}
            </div>
            <div className={styles.loginBoxFormInputWapper}>
              <label>Powtórz hasło</label>
              <input
                type="password"
                onChange={(e) => setSecondPassword(e.target.value)}
              />
              {errors.secondPassword && (
                <p className={styles.inputAlert}>{errors.secondPassword}</p>
              )}
              {errors.other && (
                <p className={styles.inputAlert}>{errors.other}</p>
              )}
            </div>
            <button onClick={onRegister}>Utwórz konto</button>
          </div>
          <div className={styles.redirect}>
            <p>Masz już konto?</p>
            <button onClick={props.onLoginModalOpen}>Zaloguj</button>
          </div>
        </div>
    </Modal>
  );
};


interface HeaderProps {
  pagesData: Page[]
}


const Header = (props: HeaderProps) => {

  const {user, login, register, logout} = useUserContext()

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const onRegisterModalOpen = () => {
    setIsLoginModalOpen(false)
    setIsRegisterModalOpen(true)
  }

  const onLoginModalOpen = () => {
    setIsRegisterModalOpen(false)
    setIsLoginModalOpen(true)
  }

  return (
    <div className={styles.main}>
      <LoginModal onRegisterModalOpen={onRegisterModalOpen} onLogin={login} isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)}/>
      <RegisterModal onLoginModalOpen={onLoginModalOpen} onRegister={register} isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)}/>
      <div className={styles.logo}>
        <h1>MotoSpoko</h1>
      </div>
      <div className={styles.nav}>
        {
          props.pagesData.map(page => (
            <NavButton key={page.id} page={page}/>
          ))
        }
      </div>
      <div className={styles.userInfo}>
        {user && user.email}
        {user ? <button onClick={logout}>Wyloguj</button> : <button onClick={() => setIsLoginModalOpen(true)}>Zaloguj</button>}
      </div>
    </div>
  );
};

export default Header;
