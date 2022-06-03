import styles from "../styles/signup.module.scss";
import classNames from "classnames";
import { useState } from "react";
import Start from "../components/Start";
import BasicInfo from "../components/BasicInfo";
import Jobs from "../components/Jobs";

const Page = (props) => {
  const [activePage, setActivePage] = useState(0);

  return (
    <div className={styles.container}>
      <nav className={styles.sidenav}>
        <img src="/paddlefest-logo.png" alt="logo" className={styles.logo} />
        <h1>Volunteer Signup</h1>
        <div className={styles.navs}>
          <button
            onClick={() => setActivePage(0)}
            className={activePage == 0 ? styles.active : undefined}
          >
            Welcome
          </button>
          <button
            onClick={() => setActivePage(1)}
            className={activePage == 1 ? styles.active : undefined}
          >
            Basic Information
          </button>
          <button
            onClick={() => setActivePage(2)}
            className={activePage == 2 ? styles.active : undefined}
          >
            Job selection
          </button>
        </div>
      </nav>
      <main className={styles.main}>
        <div className={styles.content}>
          <div style={{ display: activePage == 0 ? "initial" : "none" }}>
            <Start />
          </div>
          <div style={{ display: activePage == 1 ? "initial" : "none" }}>
            <BasicInfo />
          </div>
          <div style={{ display: activePage == 2 ? "initial" : "none" }}>
            <Jobs />
          </div>
        </div>
        <div className={styles.nav}>
          <button
            onClick={() => activePage >= 0 && setActivePage(activePage - 1)}
          >
            Back
          </button>
          <button
            onClick={() => activePage <= 5 && setActivePage(activePage + 1)}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default Page;
