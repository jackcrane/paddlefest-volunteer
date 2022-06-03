import styles from "../styles/signup.module.scss";
import classNames from "classnames";
import { useState } from "react";
import Start from "../components/Start";
import BasicInfo from "../components/BasicInfo";
import Jobs from "../components/Jobs";
import Dates from "../components/Dates";

const Page = (props) => {
  const [activePage, setActivePage] = useState(0);

  const [_basicInfo, set_BasicInfo] = useState({});
  const [events, setEvents] = useState([]);

  return (
    <div className={styles.container}>
      <nav className={styles.sidenav}>
        <img
          src="/paddlefest-logo.png"
          alt="logo"
          onClick={() =>
            (document.location.href = "https://ohioriverpaddlefest.org")
          }
        />
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
            Event selection
          </button>
          <button
            onClick={() => setActivePage(3)}
            className={activePage == 3 ? styles.active : undefined}
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
            <BasicInfo setValues={(v) => set_BasicInfo(v)} />
          </div>
          <div style={{ display: activePage == 2 ? "initial" : "none" }}>
            <Dates setValues={(v) => setEvents(v)} />
          </div>
          <div style={{ display: activePage == 3 ? "initial" : "none" }}>
            <Jobs events={events} />
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
