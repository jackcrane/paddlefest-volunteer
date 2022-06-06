import classNames from "classnames";
import moment from "moment";
import { useState, useEffect } from "react";
import styles from "../styles/signup.module.scss";

const _jobs = [
  {
    id: 1,
    name: "Beer tent",
    description: "Work the beer tent",
    restrictions: ["Must be over 21"],
    teamSize: 4,
    location: "expo",
    shifts: [
      {
        id: 1,
        start: "2020-06-01T19:00:00.000Z",
        end: "2020-06-01T20:00:00.000Z",
      },
      {
        id: 2,
        start: "2020-06-01T20:00:00.000Z",
        end: "2020-06-01T21:00:00.000Z",
      },
    ],
  },
  {
    id: 2,
    name: "Raffle Ticket Seller",
    description:
      "Sell raffle tickets and float around the expo engaging with paddlers",
    restrictions: [],
    teamSize: 4,
    location: "expo",
    shifts: [
      {
        id: 1,
        start: "2020-06-01T19:00:00.000Z",
        end: "2020-06-01T20:00:00.000Z",
      },
    ],
  },
  {
    id: 3,
    name: "Merch Sales",
    description: "Work the OAC merch sales booth",
    restrictions: [],
    teamSize: 2,
    location: "expo",
    shifts: [
      {
        id: 1,
        start: "2020-06-01T19:00:00.000Z",
        end: "2020-06-01T20:00:00.000Z",
      },
    ],
  },
  {
    id: 4,
    name: "Food Sales",
    description: "Sell food",
    restrictions: [],
    teamSize: 4,
    location: "expo",
  },
  {
    id: 5,
    name: "Launcher",
    description: "Launch boats into the river",
    restrictions: [],
    teamSize: 10,
    location: "putin",
  },
  {
    id: 6,
    name: "Boat hauler",
    description: "Haul boats to the river",
    restrictions: [],
    teamSize: 40,
    location: "putin",
  },
  {
    id: 7,
    name: "Boat hauler",
    description: "Haul boats from cars to overnight storage",
    restrictions: [],
    teamSize: 40,
    location: "expo",
  },
  {
    id: 8,
    name: "Final checker",
    description: "Make sure paddlers are prepared for their voyage",
    restrictions: [],
    teamSize: 10,
    location: "putin",
  },
  {
    id: 9,
    name: "Food Vendor",
    description: "Serve food to paddlers",
    restrictions: [],
    teamSize: 4,
    location: "midpoint",
  },
  {
    id: 10,
    name: "Food Vendor",
    description: "Serve food to paddlers",
    restrictions: [],
    teamSize: 4,
    location: "finishline",
  },
  {
    id: 11,
    name: "Boat hauler",
    description: "Haul boats from the waterline to cars or storage",
    restrictions: [],
    teamSize: 4,
    location: "finishline",
  },
  {
    id: 12,
    name: "Floater/general",
    description:
      "Select this job if you are not sure or don't have a preference for a job. We will place you where you are most needed.",
    restrictions: [],
    teamSize: 10,
    location: "expo",
  },
  {
    id: 13,
    name: "Floater/general",
    description:
      "Select this job if you are not sure or don't have a preference for a job. We will place you where you are most needed.",
    restrictions: [],
    teamSize: 10,
    location: "putin",
  },
  {
    id: 14,
    name: "Floater/general",
    description:
      "Select this job if you are not sure or don't have a preference for a job. We will place you where you are most needed.",
    restrictions: [],
    teamSize: 10,
    location: "midpoint",
  },
  {
    id: 14,
    name: "Floater/general",
    description:
      "Select this job if you are not sure or don't have a preference for a job. We will place you where you are most needed.",
    restrictions: [],
    teamSize: 10,
    location: "finishline",
  },
];

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
              job.shifts.map(
                (shift, i) =>
                  shift.volunteers.length <= shift.max && (
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
              )
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
        setEvent("Put-in");
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
  let __jobs = _jobs;
  const [jobs, setJobs] = useState(
    // __jobs.filter((j) => j.location === props.event)
    []
  );

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
