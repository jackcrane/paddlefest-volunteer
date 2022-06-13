import styles from "../styles/signup.module.scss";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import classNames from "classnames";

const Option = (props) => {
  const [checked, setChecked] = useState(props.checked);
  const [uuid] = useState(uuidv4());
  const Handle = () => {
    setChecked(!checked);
    props.onLocalChange();
  };
  return (
    <div
      className={classNames(
        styles.option,
        checked ? styles.checked : styles.unchecked
      )}
      onClick={() => Handle()}
    >
      <label className={styles.label} htmlFor={uuid}>
        {props.children}
      </label>
      <input
        type="checkbox"
        className={styles.checkbox}
        onChange={Handle}
        id={uuid}
        checked={checked}
      />
    </div>
  );
};

const Dates = (props) => {
  const [outdoorsForAll, setOutdoorsForAll] = useState(false);
  const [launch, setLaunch] = useState(false);
  const [midPoint, setMidPoint] = useState(false);
  const [finishLine, setFinishLine] = useState(false);

  const [values, setValues] = useState([]);

  useEffect(() => {
    const newValues = [
      outdoorsForAll && "expo",
      launch && "launch",
      midPoint && "midpoint",
      finishLine && "finishline",
    ].filter((itm) => itm);
    setValues(newValues);
    props.setValues(newValues);
  }, [outdoorsForAll, launch, midPoint, finishLine]);

  return (
    <div>
      <h1>When and where do you want to work?</h1>
      <p>
        Select the events you want to work. You can select multiple, but
        remember you can't work at different places at the same time (You cannot
        do both 4.5 Mile Finish Line / Midpoint AND the Finish Line Festival).
        You will select the role you want to play and the specific times you are
        availible on the next page.
      </p>
      <div className={styles.options}>
        <Option
          checked={outdoorsForAll}
          onLocalChange={() => setOutdoorsForAll(!outdoorsForAll)}
        >
          <p>Schmidt Field</p>
          <p className={styles.bigdate}>Outdoors for All Expo</p>
          <p>Friday night (August 5th)</p>
        </Option>
        <Option checked={launch} onLocalChange={() => setLaunch(!launch)}>
          <p>Schmidt Field</p>
          <p className={styles.bigdate}>Put-in</p>
          <p>Saturday early morning (August 6th)</p>
        </Option>
        <Option checked={midPoint} onLocalChange={() => setMidPoint(!midPoint)}>
          <p>Public Landing (downtown)</p>
          <p className={styles.bigdate}>4.5 Mile Finish Line / Midpoint</p>
          <p>Saturday day (August 6th)</p>
        </Option>
        <Option
          checked={finishLine}
          onLocalChange={() => setFinishLine(!finishLine)}
        >
          <p>Gilday Park</p>
          <p className={styles.bigdate}>Finish Line Festival</p>
          <p>Saturday day (August 6th)</p>
        </Option>
        {midPoint && finishLine && (
          <p className={styles.error}>
            You cannot work at the Finish Line Festival and 4.5 Mile Finish Line
            / Midpoint at the same time.
          </p>
        )}
      </div>
    </div>
  );
};

export default Dates;
