import React, { useState, useEffect } from "react";
import styles from "../styles/admin.module.scss";
import Input from "../components/Input";
import {
  ActivityHeartbeat,
  DropletFilled2,
  ExternalLink,
  Id,
  Mail,
  MoodSmile,
  Phone,
  Ticket,
  UserExclamation,
} from "tabler-icons-react";
import Modal from "../components/Modal";
import JobModal from "../components/JobModal";
import moment from "moment";
import ProgressBar from "../components/ProgressBar";
import ParsePhone from "../components/admin/ParsePhone";
const F = (props) => {
  return (
    <div
      style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
    >
      {props.children}
    </div>
  );
};

const Admin = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const [webRequestCount, setWebRequestCount] = useState(0);

  useEffect(() => {
    const tok = localStorage.getItem("token");
    if (!tok || tok !== "Paddlefest2022!!") {
      // console.log(localStorage.getItem("token"));
      setLoggedIn(false);
    } else {
      setLoggedIn(true);
    }
  }, []);

  const [volunteers, setVolunteers] = useState([]);
  const [updateTick, setUpdateTick] = useState(0);
  useEffect(() => {
    console.log("Fetching new info");
    (async () => {
      let f = await fetch(
        "https://paddlefestbackend.jackcrane.rocks/volunteers"
      );
      setWebRequestCount(webRequestCount + 1);
      let volunteers = await f.json();
      setVolunteers(volunteers.reverse());
      console.log("Volunteers updated");
    })();
  }, [updateTick]);

  useEffect(() => {
    const si = setInterval(() => {
      setUpdateTick((updateTick) => updateTick + 1);
      console.log("Set update tick", updateTick);
    }, 1000);
    return () => clearInterval(si);
  }, []);

  const [modal, setModal] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [page, setPage] = useState(1);

  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    (async () => {
      let f = await fetch(`https://paddlefestbackend.jackcrane.rocks/jobs`);
      setWebRequestCount(webRequestCount + 1);
      let jobs = await f.json();
      setJobs(jobs);
      console.log("Jobs updated");
    })();
  }, [updateTick]);

  const [jobModal, setJobModal] = useState("");
  const [jobModalOpen, setJobModalOpen] = useState(false);

  const [filter, setFilter] = useState("");

  const RunFilter = (d) => {
    if (filter === "") {
      return d;
    } else {
      return d.filter((v) =>
        JSON.stringify(v).toLowerCase().includes(filter.toLowerCase())
      );
    }
  };

  if (!loggedIn) {
    return (
      <div className={styles.admin}>
        <h1>You are not logged in!</h1>
        <Input
          placeholder="Enter the password"
          onInput={(v) => {
            console.log(v);
            if (v === "Paddlefest2022!!") {
              setLoggedIn(true);
              localStorage.setItem("token", "Paddlefest2022!!");
              console.log("in");
            }
          }}
        />
      </div>
    );
  }

  const incrementFetchCount = () => {
    setWebRequestCount((webRequestCount) => webRequestCount + 1);
  };

  return (
    <div className={styles.container}>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        _id={modal}
        incrementFetchCount={incrementFetchCount}
      />
      <JobModal
        open={jobModalOpen}
        onClose={() => setJobModalOpen(false)}
        _id={jobModal}
        openVolunteer={(volunteer) => {
          setModal(volunteer);
          setModalOpen(true);
        }}
        incrementFetchCount={incrementFetchCount}
      />
      <nav>
        <h1>Volunteer Listing</h1>
        <div className={styles.navs}>
          <button onClick={() => setPage(1)}>Volunteers</button>
          <button onClick={() => setPage(2)}>Jobs</button>
          <button
            onClick={() =>
              window.open(
                "https://paddlefestbackend.jackcrane.rocks/export",
                "_blank"
              )
            }
          >
            Export Records
          </button>
          <button
            onClick={() =>
              window.open(
                "https://paddlefestbackend.jackcrane.rocks/create-jobs",
                "_blank"
              )
            }
          >
            Create a new job
          </button>
        </div>
        <Input
          type="text"
          placeholder="Search"
          onInput={(d) => {
            setFilter(d);
          }}
        />
      </nav>
      {page === 1 ? (
        <main>
          <h1>Volunteers</h1>
          <p>
            Here is a listing of every volunteer and their commitments and
            contact information. To modify a listing, click the volunteer's row.
          </p>
          <div className={styles.tableParent}>
            <table>
              <thead>
                <tr>
                  <th>
                    <F>
                      Name <MoodSmile height={18} />
                    </F>
                  </th>
                  <th className={styles.hideOnSmall}>
                    <F>
                      Email <Mail height={18} />
                    </F>
                  </th>
                  <th>
                    <F>
                      Phone <Phone height={18} />
                    </F>
                  </th>
                  <th className={styles.hideOnSmall}>
                    <F>
                      Jobs <ActivityHeartbeat height={18} />
                    </F>
                  </th>
                </tr>
              </thead>
              <tbody>
                {RunFilter(volunteers).map((volunteer, i) => (
                  <tr
                    key={i}
                    onClick={() => {
                      setModal(volunteer._id);
                      setModalOpen(true);
                    }}
                  >
                    <td>
                      <F>
                        {volunteer.name}
                        {!volunteer.waiver && (
                          <span
                            style={{
                              border: "2px solid red",
                              padding: 3,
                              marginLeft: 5,
                            }}
                          >
                            <F>
                              <UserExclamation height={18} color="red" />
                              <span className={styles.hideOnSmall}>
                                No Waiver!
                              </span>
                            </F>
                          </span>
                        )}
                      </F>
                    </td>
                    <td className={styles.hideOnSmall}>
                      <F>
                        {volunteer.email}
                        <a href={`mailto:${volunteer.email}`}>
                          <ExternalLink height={18} />
                        </a>
                      </F>
                    </td>
                    <td>
                      <F>
                        {ParsePhone(volunteer.phonenum)}
                        <a href={`tel:${volunteer.phonenum}`}>
                          <ExternalLink height={18} />
                        </a>
                      </F>
                    </td>
                    <td className={styles.hideOnSmall}>
                      Click here to open jobs
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Showing {filter.length > 0 ? RunFilter(volunteers).length : "all"}{" "}
            of {volunteers.length} records.
          </p>
          {filter.length > 0 && (
            <>
              <b>
                <br />
                Results are filtered by search term "{filter}". Remove the query
                from the search bar above.
              </b>
            </>
          )}
        </main>
      ) : (
        <main>
          <h1>Jobs</h1>
          <p>
            Here is a listing of every job. Click a job to see its shifts and
            volunteers
          </p>
          <div className={styles.tableParent}>
            <table>
              <thead>
                <tr>
                  <th>
                    <F>
                      Job Name <Id height={18} />
                    </F>
                  </th>
                  <th className={styles.hideOnSmall}>
                    <F>
                      Event <Ticket height={18} />
                    </F>
                  </th>
                  <th>
                    <F>
                      Fill state
                      <DropletFilled2 height={18} />
                    </F>
                  </th>
                </tr>
              </thead>
              <tbody>
                {RunFilter(jobs).map((job, i) => (
                  <tr
                    key={i}
                    onClick={() => {
                      setJobModal(job._id);
                      setJobModalOpen(true);
                    }}
                  >
                    <td>
                      <F>{job.title}</F>
                    </td>
                    <td>
                      <F>{job.location}</F>
                    </td>
                    <td>
                      <ul>
                        {job.shifts.map((shift, i) => (
                          <li key={i}>
                            <>
                              {moment(shift.start).format("h:mm a")} -{" "}
                              {moment(shift.end).format("h:mm a")}:{" "}
                              {shift.volunteers.length} / {shift.max}{" "}
                            </>
                            <div className={styles.hideOnSmall}>
                              <ProgressBar
                                width={Math.floor(
                                  (shift.volunteers.length / shift.max) * 100
                                )}
                              />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Showing {filter.length > 0 ? RunFilter(jobs).length : "all"} of{" "}
            {jobs.length} records.
          </p>
          {filter.length > 0 && (
            <>
              <b>
                <br />
                Results are filtered by search term "{filter}". Remove the query
                from the search bar above.
              </b>
            </>
          )}
        </main>
      )}
      <main>
        <p>
          Debug info: There have been {webRequestCount} web requests this
          session.
        </p>
      </main>
    </div>
  );
};
export default Admin;
