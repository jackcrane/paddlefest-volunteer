import { switchForLocation } from "../Modal";
import { Job } from "./Job";

export const Locs = ({ volunteer, jobs, forceUpdate }) => {
  // Locations
  return (
    <>
      {Object.keys(jobs).map((loc, i) => {
        return (
          <details key={i}>
            <summary>{switchForLocation(loc)}</summary>
            {Object.keys(jobs[loc]).map((job, i) => (
              <Job
                volunteer={volunteer}
                key={i}
                job={job}
                forceUpdate={forceUpdate}
              />
            ))}
          </details>
        );
      })}
    </>
  );
};
