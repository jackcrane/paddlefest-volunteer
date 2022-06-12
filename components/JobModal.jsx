import styles from "../styles/Modal.module.scss";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import { ExternalLink } from "tabler-icons-react";
import moment from "moment";
import classNames from "classnames";

const F = (props) => {
  return (
    <div
      style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
    >
      {props.children}
    </div>
  );
};

const switchForLocation = (location) => {
  switch (location) {
    case "expo":
      return "Outdoors for All Expo";
      break;
    case "putin":
      return "Put-in";
      break;
    case "midpoint":
      return "4.5 Mile Finish Line / Midpoint";
      break;
    case "finishline":
      return "Finish Line Festival";
      break;
    default:
      return location;
  }
};

const VolunteerForName = (props) => {
  const [volunteer, setVolunteer] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      let f = await fetch(
        `https://paddlefestbackend.jackcrane.rocks/volunteer/${props.volunteer}`
      );
      let volunteer = await f.json();

      setVolunteer(volunteer);
      setLoading(false);
    })();
  }, [props.volunteer]);
  if (loading) {
    return <span>Loading...</span>;
  }
  return (
    <div className={styles.volunteerName}>
      <F>
        {props.email && props.email === true ? volunteer.email : volunteer.name}
      </F>
    </div>
  );
};

const JobModal = ({ open, onClose, _id, openVolunteer }) => {
  const [working, setWorking] = useState(true);
  const [job, setJob] = useState({});

  const [updateTick, setUpdateTick] = useState(0);

  useEffect(() => {
    (async () => {
      if (open) {
        setWorking(true);
        let f = await fetch(
          `https://paddlefestbackend.jackcrane.rocks/jobs/exchange/job/${_id}`
        );
        let volunteer = await f.json();
        setJob(volunteer);
        setWorking(false);
      }
    })();
  }, [_id, updateTick]);

  const [volunteerDisplayType, setVolunteerDisplayType] = useState("name");

  return open ? (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h1>Job Details</h1>
          <button onClick={onClose}>Close</button>
        </div>
        <div className={styles.modalBody}>
          {working ? (
            <div className={styles.loading}>
              <Loader />
              <p>Loading information for job {_id}...</p>
              <p>This should not take more than a few moments.</p>
            </div>
          ) : (
            <>
              <div className={styles.modalInfo}>
                <table>
                  <tbody>
                    <tr>
                      <td>Name</td>
                      <td>{job.title}</td>
                    </tr>
                    <tr>
                      <td>Location</td>
                      <td>{switchForLocation(job.location)}</td>
                    </tr>
                    <tr>
                      <td>Description</td>
                      <td>
                        <F>{job.description}</F>
                      </td>
                    </tr>
                    <tr>
                      <td>Restrictions</td>
                      <td>
                        <F>
                          {job.restrictions.length === 0 && "None"}
                          {job.restrictions.map((restriction, i) => (
                            <span key={i}>{restriction}</span>
                          ))}
                        </F>
                      </td>
                    </tr>
                    <tr>
                      <td>Job ID number</td>
                      <td>
                        <code>{_id}</code>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <h2>Shifts and volunteers</h2>
                <>
                  <table>
                    <thead>
                      <tr>
                        <th>Shift time</th>
                        <th>
                          Volunteers{" "}
                          <span className={styles.displayTool}>
                            Display as:{" "}
                            <button
                              className={classNames(
                                styles.switcher,
                                volunteerDisplayType === "email" &&
                                  styles.active
                              )}
                              onClick={() => setVolunteerDisplayType("email")}
                            >
                              email
                            </button>{" "}
                            <button
                              className={classNames(
                                styles.switcher,
                                volunteerDisplayType === "name" && styles.active
                              )}
                              onClick={() => setVolunteerDisplayType("name")}
                            >
                              name
                            </button>
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {job.shifts.map((shift, i) => (
                        <tr>
                          <td>
                            {moment(shift.start).format("h:mm a")} -{" "}
                            {moment(shift.end).format("h:mm a")}
                          </td>
                          <td>
                            {shift.volunteers.length === 0 && (
                              <span>
                                There are no volunteers signed up for this shift
                              </span>
                            )}
                            <ul>
                              {shift.volunteers.map((volunteer, j) => (
                                <li key={j}>
                                  <F>
                                    <VolunteerForName
                                      volunteer={volunteer}
                                      email={volunteerDisplayType === "email"}
                                    />
                                    <ExternalLink
                                      height={18}
                                      style={{
                                        color: "#3367ff",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => {
                                        onClose();
                                        openVolunteer(volunteer);
                                      }}
                                    />
                                  </F>
                                </li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default JobModal;
