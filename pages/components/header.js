import { Head } from "next/head";
import styles from "../dashboard.module.css";

export const Header = (props) => {
  const { handleLogout } = props;
  return (
    <div className={styles.header}>
      <div className={styles.profile}>
        <span>AS</span>
      </div>
      <div className={styles.btn}>
        <button className={styles.action} onClick={handleLogout}>
          Log out
        </button>
      </div>
    </div>
  );
};
