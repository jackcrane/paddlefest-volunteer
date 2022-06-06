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
  const [jobs, setJobs] = useState([]);

  const [working, setWorking] = useState(false);

  const submit = async () => {
    setWorking(true);

    // Verify everything is filled out
    if (
      !_basicInfo.name ||
      !_basicInfo.email ||
      !_basicInfo.phonenum ||
      !_basicInfo.shirt_size
    ) {
      alert("Please fill out all fields");
      setWorking(false);
      setActivePage(1);
      return;
    }
    if (events.length === 0) {
      alert("Please select at least one event");
      setWorking(false);
      setActivePage(2);
      return;
    }
    if (jobs.length === 0) {
      alert("Please select at least one and shift");
      setWorking(false);
      setActivePage(3);
      return;
    }

    let f = await fetch("http://localhost:3001/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        basicInfo: _basicInfo,
        jobs: jobs,
      }),
    });
    let res = await f.json();
    setWorking(false);
    if (f.status === 200) {
      document.location.href = "/thanks";
    } else {
      alert("Something went wrong. Make sure everything is present!");
    }
  };

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
          <button
            onClick={() => setActivePage(4)}
            className={activePage == 4 ? styles.active : undefined}
          >
            Submit
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
            <Jobs events={events} setValues={(v) => setJobs(v)} />
          </div>
          <div style={{ display: activePage == 4 ? "initial" : "none" }}>
            <h1>Finished?</h1>
            <p>
              Make sure you have everything correct, then click submit below! We
              will email you a copy of your responses.
            </p>
            <button onClick={submit}>Submit!</button>
          </div>
        </div>
        <div className={styles.nav}>
          <button
            onClick={() => activePage >= 0 && setActivePage(activePage - 1)}
          >
            Back
          </button>
          <button
            onClick={() => activePage <= 3 && setActivePage(activePage + 1)}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default Page;
