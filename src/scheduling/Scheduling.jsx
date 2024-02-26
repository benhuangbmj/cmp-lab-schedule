import { useState, useRef, useEffect } from "react";
import { days, times } from "/src/utils";
import { update } from "../api-operations";

import Timetable from "./Timetable";
import Button from "react-bootstrap/Button";

export default function Scheduling({ info, fetchInfo, selected }) {
  const cleanSlate = Array.from(times, () => Array.from(Array(4), () => false));
  const [slots, setSlots] = useState(cleanSlate);
  const tutorSlots = useRef();

  const handleReset = () => {
    const resetSlots = Array.from(tutorSlots.current);
    setSlots(resetSlots);
  };

  const handleClear = () => {
    setSlots(cleanSlate);
  };

  const handleUpdate = () => {
    const createSchedule = () => {
      const tutorDays = [];
      const tutorTimes = [];
      for (let j = 0; j < 4; j++) {
        let currTimes = "";
        let begin;
        let end;
        for (let i = 0; i < times.length; i++) {
          if (slots[i][j]) {
            end = begin ? times[i] : null;
            begin = begin ? begin : times[i];
          } else if (begin) {
            currTimes += begin + " - " + end + "\n";
            begin = null;
            end = null;
          }
        }
        if (end) {
          currTimes += begin + " - " + end + "\n";
        }
        if (currTimes != "") {
          tutorTimes.push(currTimes);
          tutorDays.push(days[j]);
        }
      }
      const output = Object.assign(info[selected], {
        day: tutorDays,
        time: tutorTimes,
        schedule: slots,
      });
      return output;
    };
    const data = createSchedule();
    update(selected, [], data, fetchInfo);
  };

  useEffect(() => {
    if (selected) {
      if (info[selected].schedule) {
        let schedule = info[selected].schedule;
        //Write a script to update the current database so that the concrete data will be consistent with the schema.
        if (schedule.length < 57) {
          schedule = Array.from(Array(53 - schedule.length), () =>
            Array(4).fill(false),
          )
            .concat(schedule)
            .concat(Array.from(Array(4), () => Array(4).fill(false)));
        }
        //
        setSlots(schedule);
        tutorSlots.current = JSON.parse(JSON.stringify(schedule));
      } else {
        setSlots(cleanSlate);
        tutorSlots.current = cleanSlate;
      }
    } else {
      setSlots(cleanSlate);
      tutorSlots.current = cleanSlate;
    }
  }, [selected]);
  return (
    <div>
      <Timetable
        tutor={selected ? info[selected].name : null}
        slots={slots}
        setSlots={setSlots}
      />
      <div>
        <Button
          disabled={selected == null}
          type="button"
          style={{ display: "inline-block" }}
          onClick={handleUpdate}
        >
          Update
        </Button>
        <Button
          type="button"
          style={{ display: "inline-block" }}
          onClick={handleReset}
        >
          Reset
        </Button>
        <Button
          type="button"
          style={{ display: "inline-block" }}
          onClick={handleClear}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
