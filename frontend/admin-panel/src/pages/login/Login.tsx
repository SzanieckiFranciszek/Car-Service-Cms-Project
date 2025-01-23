import { useState } from "react";
import styles from "./login.module.scss";
import { useUserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { PathsEnum } from "../../routes-info";

interface Errors {
  [key: string]: string;
}

const Login = () => {
  const [errors, setErrors] = useState<Errors>({});
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { login } = useUserContext();
  const navigate = useNavigate();

  const validateForm = () => {
    let formIsValid = true;
    const errors: Errors = {};

    if (!email) {
      formIsValid = false;
      errors["username"] = "Proszę wprowadzic nazwę użytkownika.";
    }

    if (!password) {
      formIsValid = false;
      errors["password"] = "Podaj treść.";
    }

    setErrors(errors);
    return formIsValid;
  };

  const onLogin = async () => {
    if (validateForm()) {
      if (await login(email, password)) {
        navigate(PathsEnum.HOME);
      } else {
        setErrors({ other: "Nieprawidłowe dane logowania" });
      }
    }
  };

  return (
    <div className={styles.login}>
      <div className={styles.loginBox}>
        <div className={styles.loginBoxTop}></div>
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
        </div>
      </div>
    </div>
  );
};

export default Login;
