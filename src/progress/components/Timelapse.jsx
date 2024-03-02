import { useState, useEffect } from "react";

import ProgressBar from "react-bootstrap/ProgressBar";

const getTime = (seconds) => {
  let sec = seconds % 60;
  const minutes = Math.floor(seconds / 60);
  let min = minutes % 60;
  let hr = Math.floor(minutes / 60);

  const addZero = (str) => {
    let output = str;
    if (str.length == 1) {
      output = "0" + str;
    }
    return output;
  };

  sec = addZero(sec.toString());
  min = addZero(min.toString());

  const output = [hr.toString(), min, sec].join(":");
  return output;
};

const Timelapse = function ({ task, displayedFields, shownOnMobile }) {
  const [curr, setCurr] = useState(calculateCumulative());
  const [lapse, setLapse] = useState(getTime(curr));

  function calculateCumulative() {
    return task.in_progress
      ? task.cumulative + (Date.now() - task.in_progress)
      : task.cumulative;
  }

  useEffect(() => {
    setLapse(getTime(Math.floor(curr / 1000)));
  }, [curr]);

  useEffect(() => {
    if (task.in_progress) {
      setCurr(calculateCumulative());
      const interval = setInterval(() => {
        setCurr((curr) => curr + 1000);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [task]);

  return (
    <>
      {Object.keys(task).map((key) => {
        if (displayedFields.includes(key)) {
          let value = task[key];
          if (key == "created_at") {
            value = new Date(value).toLocaleString("en-US", {
              timeZone: "America/New_York",
            });
          }
          return (
            <td
              key={key}
              className={!shownOnMobile.includes(key) ? "hidden-on-mobile" : ""}
            >
              {value}{" "}
            </td>
          );
        }
      })}
      <td>
        {lapse}{" "}
        <ProgressBar
          now={task.complete ? 100 : curr / 1000 / 108}
          variant={
            task.complete
              ? "warning"
              : task.in_progress
                ? "success"
                : "secondary"
          }
          animated={task.in_progress}
        />
      </td>
    </>
  );
};
export default Timelapse;
