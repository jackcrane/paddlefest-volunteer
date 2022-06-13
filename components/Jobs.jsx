import classNames from "classnames";
import moment from "moment";
import { useState, useEffect } from "react";
import styles from "../styles/signup.module.scss";

const Job = (props) => {
  let job = props.job;
  job.name = job.title;
  const [selectedShifts, setSelectedShifts] = useState([]);

  const handleClick = (id) => {
    if (selectedShifts.includes(id)) {
      setSelectedShifts(selectedShifts.filter((shift) => shift !== id));
    } else {
      setSelectedShifts([...selectedShifts, id]);
    }
  };

  useEffect(() => {
    props.handle(selectedShifts);
  }, [selectedShifts]);

  return (
    <div className={styles.job}>
      <div className={styles.title}>
        <h3>{job.name}</h3>
        {job.restrictions.length > 0 && (
          <div className={styles.restrictions}>
            {job.restrictions.map((r, i) => (
              <p key={i}>{r}</p>
            ))}
          </div>
        )}
      </div>
      <div className={styles.description}>
        <p>{job.description}</p>
        <details>
          <summary className={styles.summary}>View Shifts</summary>
          <div className={styles.shifts}>
            {job.shifts ? (
              <>
                {job.shifts.map(
                  (shift, i) =>
                    shift.volunteers.length < shift.max && (
                      <div
                        key={i}
                        className={classNames(
                          styles.shift,
                          selectedShifts.includes(shift._id) && styles.selected
                        )}
                        onClick={() => handleClick(shift._id)}
                      >
                        <p>
                          {moment(shift.start).format("h:mm a")} -{" "}
                          {moment(shift.end).format("h:mm a")}
                        </p>
                      </div>
                    )
                )}
                {job.shifts.filter(
                  (shift) => shift.volunteers.length >= shift.max
                ).length > 0 && (
                  <p>
                    One or more shifts are full and have been automatically
                    hidden.
                  </p>
                )}
              </>
            ) : (
              <p>No shifts availible for this job</p>
            )}
          </div>
        </details>
        <p className={selectedShifts.length > 0 ? styles.blue : undefined}>
          You have selected {selectedShifts.length} shift
          {selectedShifts.length != 1 && "s"} from this job.
        </p>
      </div>
    </div>
  );
};

const EventJobs = (props) => {
  const [eventCode, setEventCode] = useState(props.event);
  const [event, setEvent] = useState(props.event);
  useEffect(() => {
    switch (props.event) {
      case "expo":
        setEvent("Outdoors for All Expo");
        break;
      case "putin":
        setEvent("Launch");
        break;
      case "launch":
        return "Launch";
        break;
      case "midpoint":
        setEvent("4.5 Mile Finish Line / Midpoint");
        break;
      case "finishline":
        setEvent("Finish Line Festival");
        break;
      default:
        setEvent(props.event);
    }
  }, [props.event]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    setJobs([]);
    (async () => {
      let jfetch = await fetch(
        `https://paddlefestbackend.jackcrane.rocks/list-jobs/${props.event}`
      );
      if (jfetch.status !== 200) {
        alert(
          "Error fetching jobs. Please contact the developer at jack@jackcrane.rocks or 513-628-9360 asap so I can fix it!"
        );
        return;
      } else {
        let jobs = await jfetch.json();
        setJobs(jobs);
      }
    })();
  }, [props.event]);

  const [selectedJobs, setSelectedJobs] = useState({});

  const handle = (shift, _id) => {
    setSelectedJobs({
      ...selectedJobs,
      [_id]: shift,
    });
  };
  useEffect(() => {
    props.handle(selectedJobs);
  }, [selectedJobs]);

  return (
    <div>
      <h2>{event}</h2>
      <div className={styles.jobList}>
        {jobs.map((job, i) => (
          <Job key={i} job={job} handle={(d) => handle(d, job._id)} />
        ))}
      </div>
    </div>
  );
};

const Signup = (props) => {
  const [selectedJobs, setSelectedJobs] = useState({});
  const handle = (job, _id) => {
    setSelectedJobs({
      ...selectedJobs,
      [_id]: job,
    });
  };
  useEffect(() => {
    props.setValues(selectedJobs);
  }, [selectedJobs]);

  return (
    <div>
      <h1>Select a job and time</h1>
      <p>
        First, select the role you want to have, then choose one or multiple
        shifts from the availible times that pop up. Jobs are automatically
        filtered for the event you have selected.
      </p>
      {props.events.length === 0 && (
        <p>
          <strong>
            You need to select an event on the previous page before choosing
            jobs.
          </strong>
        </p>
      )}
      {props.events.map((e, i) => (
        <EventJobs key={i} event={e} handle={(d) => handle(d, e)} />
      ))}
    </div>
  );
};

export default Signup;
export { Job };
