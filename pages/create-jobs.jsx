import { useState, useEffect } from "react";
import Input from "../components/Input";
import styles from "../styles/signup.module.scss";
import { Job } from "../components/Jobs";
import moment from "moment";

const switchForDate = (date) => {
  switch (date) {
    case "expo":
      return "8/5";
    case "putin":
      return "8/6";
    case "midpoint":
      return "8/6";
    case "finishline":
      return "8/6";
    default:
      return "8/6";
  }
};

const createJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [restrictions, setRestrictions] = useState({});
  const [restrictionCount, setRestrictionCount] = useState(0);
  const [location, setLocation] = useState("");
  const [shiftCount, setShiftCount] = useState(1);
  const [shifts, setShifts] = useState({});
  useEffect(() => console.log(shifts), [shifts]);

  const submit = async () => {
    let _shifts = shifts.map((shift) => {
      shift.start = moment(
        `${switchForDate(location)} ${shift.start}`,
        "M/D HH:mm"
      ).toISOString();
      shift.end = moment(
        `${switchForDate(location)} ${shift.end}`,
        "M/D HH:mm"
      ).toISOString();
      return shift;
    });
    let f = await fetch("http://localhost:3001/create-job", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        restrictions,
        location,
        _shifts,
      }),
    });
    let j = await f.json();
    if (f.status === 200) {
      alert("Job created!");
      if (confirm("Reset form?")) {
        document.location.reload();
      }
    }
  };

  return (
    <div style={{ margin: 10 }} className={styles.create}>
      <h1>Create Job</h1>
      <Input placeholder="Job Title" onInput={setTitle} />
      <Input placeholder="Job Description" onInput={setDescription} />
      <Input
        placeholder="Job Location (options are 'expo', 'putin', 'midpoint', 'finishline')"
        onInput={(value) => {
          setLocation(value);
          if (["expo", "putin", "midpoint", "finishline"].includes(value)) {
            return {
              valid: true,
              error: "",
            };
          } else {
            return {
              valid: false,
              error: "Please select a valid location",
            };
          }
        }}
        dataList={["expo", "putin", "midpoint", "finishline"]}
        helperText="Only use the listed locations as it is how jobs are sorted"
      />
      <hr />
      <p
        style={{
          display: !["expo", "putin", "midpoint", "finishline"].includes(
            location
          )
            ? "initial"
            : "none",
        }}
      >
        Once you enter a location, you will get more options.
      </p>
      <div
        style={{
          display: ["expo", "putin", "midpoint", "finishline"].includes(
            location
          )
            ? "initial"
            : "none",
        }}
      >
        <div>
          <h2>Restrictions</h2>
          <p>
            Enter restrictions as rules that would limit people from signing up
            (e.g. "Must be over 21"). These are optional
          </p>
          <button onClick={() => setRestrictionCount(restrictionCount + 1)}>
            Add Restriction
          </button>
          {restrictionCount > 0 && (
            <div>
              {Array.from(Array(restrictionCount)).map((_, i) => (
                <Input
                  key={i}
                  placeholder={`Restriction ${i + 1}`}
                  onInput={(e) => setRestrictions({ ...restrictions, [i]: e })}
                />
              ))}
            </div>
          )}
        </div>
        <hr />
        <h2>Shifts</h2>
        <p>
          Enter shifts as a list of times that people can sign up for. These are
          not optional.
          <br />
          Because you selected a location, the date will automatically be added,
          you just need to worry about time.
        </p>
        <button onClick={() => setShiftCount(shiftCount + 1)}>Add Shift</button>
        {shiftCount > 0 && (
          <div>
            {Array.from(Array(shiftCount)).map((_, i) => (
              <div key={i} className={styles.shift}>
                <h3>Shift {i + 1}</h3>
                <p>Start:</p>
                <input
                  // value="12:00"
                  step="1800"
                  type="time"
                  onInput={(value) => {
                    const shift = {
                      ...shifts,
                      [i]: {
                        start: value.target.value,
                      },
                    };
                    setShifts(shift);
                  }}
                />
                <p>End:</p>
                <input
                  // value="12:00"
                  step="600"
                  type="time"
                  onInput={(value) => {
                    const shift = {
                      ...shifts,
                      [i]: {
                        ...shifts[i],
                        end: value.target.value,
                      },
                    };
                    setShifts(shift);
                  }}
                />
                How many people can sign up for this shift?
                <input
                  type="number"
                  min="1"
                  onInput={(value) => {
                    const shift = {
                      ...shifts,
                      [i]: {
                        ...shifts[i],
                        max: value.target.value,
                      },
                    };
                    setShifts(shift);
                  }}
                />
              </div>
            ))}
          </div>
        )}
        <hr />
        <h2>This is how the listing will look</h2>
        <div className={styles.jobList}>
          <Job
            job={{
              name: title,
              description,
              restrictions: Object.values(restrictions).filter((r) => r !== ""),
              shifts: Object.values(shifts).map((s, i) => ({
                id: i,
                start: moment(
                  `${switchForDate(location)} ${s.start}`,
                  "M/D hh:mm a"
                ).format("M/D hh:mm a"),
                end: moment(
                  `${switchForDate(location)} ${s.end}`,
                  "M/D hh:mm a"
                ).format("M/D hh:mm a"),
              })),
            }}
          />
        </div>
        {/* {JSON.stringify(
          Object.values(shifts).map((s, i) => ({
            id: i,
            start: moment(
              `${switchForDate(location)} ${s.start}`,
              "M/D hh:mm a"
            ).format("M/D hh:mm a"),
            end: moment(
              `${switchForDate(location)} ${s.end}`,
              "M/D hh:mm a"
            ).format("M/D hh:mm a"),
          }))
        )} */}
        <hr />
        <button type="submit" onClick={submit}>
          Submit!
        </button>
      </div>
    </div>
  );
};
export default createJob;
