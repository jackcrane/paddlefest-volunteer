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

const Locs = ({ volunteer, jobs, forceUpdate }) => {
  // Locations

  return (
    <>
      {Object.keys(jobs).map((loc) => {
        return (
          <details>
            <summary>{switchForLocation(loc)}</summary>
            {Object.keys(jobs[loc]).map((job) => (
              <Job volunteer={volunteer} job={job} forceUpdate={forceUpdate} />
            ))}
          </details>
        );
      })}
    </>
  );
};

const Job = (props) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      console.log(props.job);
      let f = await fetch(
        `https://paddlefestbackend.jackcrane/rocks/jobs/exchange/job/${props.job}`
      );
      let job = await f.json();
      setJob(job);
      setLoading(false);
    })();
  }, [props.job]);
  if (loading) {
    return <span>Loading...</span>;
  }
  return (
    <details className={styles.jobTitle}>
      <summary>{job.title}</summary>
      <div className={styles.jobLocation}>
        <F></F>
        <Shifts
          job={job._id}
          volunteer={props.volunteer}
          forceUpdate={props.forceUpdate}
        />
      </div>
    </details>
  );
};

const VolunteerForName = (props) => {
  const [volunteer, setVolunteer] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      let f = await fetch(
        `https://paddlefestbackend.jackcrane/rocks/volunteer/${props.volunteer}`
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
      <F>{volunteer.name}</F>
    </div>
  );
};

const ShiftOption = ({ shift, volunteer, forceUpdate }) => {
  const submit = async () => {
    let f = await fetch(`https://paddlefestbackend.jackcrane/rocks/add-shift`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shift: shift._id,
        volunteer: volunteer,
      }),
    });
    if (f.status === 200) {
      alert("Shift added!");
      forceUpdate();
    }
  };

  return (
    <div
      className={classNames(
        styles.shift,
        shift.volunteers.includes(volunteer) ? styles.disabled : undefined
      )}
      onClick={submit}
    >
      <p>
        {moment(shift.start).format("h:mm a")} -{" "}
        {moment(shift.end).format("h:mm a")}
      </p>
    </div>
  );
};

const AvailibleShifts = (props) => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      let f = await fetch(
        `https://paddlefestbackend.jackcrane/rocks/jobs/exchange/job/${props.job}`
      );
      let shifts = await f.json();
      setShifts(shifts.shifts);
      setLoading(false);
    })();
  }, [props.volunteer]);
  if (loading) {
    return <span>Loading...</span>;
  }
  return (
    <div className={styles.addShifts}>
      {shifts.map((shift) => (
        <ShiftOption
          volunteer={props.volunteer}
          shift={shift}
          forceUpdate={props.forceUpdate}
        />
      ))}
    </div>
  );
};

const Shifts = (props) => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      let f = await fetch(
        `https://paddlefestbackend.jackcrane/rocks/shifts/${props.volunteer}/${props.job}`
      );
      let shifts = await f.json();
      setShifts(shifts);
      setLoading(false);
    })();
  }, [props.volunteer, props.job]);
  if (loading) {
    return <span>Loading...</span>;
  }

  const leaveShift = (shift) => {
    (async () => {
      if (
        window.confirm(
          "Are you sure you want to remove this shift from this volunteer?"
        )
      ) {
        console.log(shift);
        let f = await fetch(
          `https://paddlefestbackend.jackcrane/rocks/remove-shift`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              shift: shift._id,
              volunteer: props.volunteer,
            }),
          }
        );
        if (f.status === 200) {
          alert("Shift has been removed from this volunteer.");
          props.forceUpdate();
        }
      }
    })();
  };

  return (
    <div className={styles.shifts}>
      {shifts.map((shift, i) => (
        <div className={styles.shift} key={i}>
          <h3>Shift {i + 1}</h3>
          <table>
            <tbody>
              <tr>
                <td>Start</td>
                <td>{moment(shift.start).format("hh:mm a")}</td>
              </tr>
              <tr>
                <td>End</td>
                <td>{moment(shift.end).format("hh:mm a")}</td>
              </tr>
              <tr>
                <td>Other volunteers</td>
                <td>
                  {shift.volunteers.map(
                    (volunteer) =>
                      volunteer !== props.volunteer && (
                        <VolunteerForName volunteer={volunteer} />
                      )
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          <div className={styles.options}>
            <button onClick={() => leaveShift(shift)} className={styles.remove}>
              Leave this shift
            </button>
          </div>
        </div>
      ))}
      <h3>Add a new shift</h3>
      <AvailibleShifts
        volunteer={props.volunteer}
        job={props.job}
        forceUpdate={props.forceUpdate}
      />
    </div>
  );
};

const Modal = ({ open, onClose, _id }) => {
  const [working, setWorking] = useState(true);
  const [volunteer, setVolunteer] = useState({});

  const [updateTick, setUpdateTick] = useState(0);

  useEffect(() => {
    (async () => {
      setWorking(true);
      let f = await fetch(
        `https://paddlefestbackend.jackcrane/rocks/volunteer/${_id}`
      );
      let volunteer = await f.json();
      setVolunteer(volunteer);
      setWorking(false);
    })();
  }, [_id, updateTick]);

  const deleteVolunteer = () => {
    (async () => {
      if (
        window.confirm(
          "Are you sure you want to delete this volunteer? This is irreversible."
        )
      ) {
        let f = await fetch(
          `https://paddlefestbackend.jackcrane/rocks/delete-volunteer`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              _id: _id,
            }),
          }
        );
        if (f.status === 200) {
          alert("Volunteer has been deleted.");
          onClose();
        }
      }
    })();
  };

  return open ? (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h1>Volunteer Details</h1>
          <button onClick={onClose}>Close</button>
        </div>
        <div className={styles.modalBody}>
          {working ? (
            <div className={styles.loading}>
              <Loader />
              <p>Loading information for volunteer {_id}...</p>
              <p>This should not take more than a few moments.</p>
            </div>
          ) : (
            <>
              <div className={styles.modalInfo}>
                <table>
                  <tbody>
                    <tr>
                      <td>Name</td>
                      <td>{volunteer.name}</td>
                    </tr>
                    <tr>
                      <td>Email</td>
                      <td>
                        <F>
                          {volunteer.email}
                          <a href={`mailto:${volunteer.email}`}>
                            <ExternalLink height={18} />
                          </a>
                        </F>
                      </td>
                    </tr>
                    <tr>
                      <td>Phone</td>
                      <td>
                        <F>
                          {volunteer.phonenum}
                          <a href={`tel:${volunteer.phonenum}`}>
                            <ExternalLink height={18} />
                          </a>
                        </F>
                      </td>
                    </tr>
                    <tr>
                      <td>Shirt size</td>
                      <td>{volunteer.shirt_size.toUpperCase()}</td>
                    </tr>
                    <tr>
                      <td>Volunteer ID number</td>
                      <td>
                        <code>{_id}</code>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <h2>Selected jobs and shifts</h2>
                <Locs
                  jobs={volunteer.jobs}
                  volunteer={volunteer._id}
                  forceUpdate={() => setUpdateTick(updateTick + 1)}
                />
                <h2>Danger zone</h2>
                <button onClick={deleteVolunteer} className={styles.delete}>
                  Delete volunteer
                </button>
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

export default Modal;
