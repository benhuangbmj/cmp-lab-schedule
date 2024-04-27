import styles from "./timetable-style.module.css";
import { useRef, useEffect, useState } from "react";
import { days, times } from "../utils";
import { themeColor } from "/src/config";

import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

function restrict(i) {
  if (i >= 40 && i < 53) {
    return true;
  } else {
    return false;
  }
}

export default function Timetable({ tutor, slots, setSlots }) {
  const mouseDown = useRef(false);
  const [extended, setExtended] = useState(false);

  useEffect(() => {
    document.addEventListener("mouseup", HandleMouseUp);
  }, []);

  const handleMouseDown = (e) => {
    mouseDown.current = true;
    const [i, j] = e.target.dataset.pos.split(",");
    const newSlots = JSON.parse(JSON.stringify(slots));
    newSlots[i][j] = !newSlots[i][j];
    setSlots(newSlots);
  };

  const HandleMouseUp = () => {
    mouseDown.current = false;
  };

  const handleMouseEnter = (e) => {
    if (mouseDown.current) {
      const [i, j] = e.target.dataset.pos.split(",");
      const newSlots = JSON.parse(JSON.stringify(slots));
      newSlots[i][j] = !newSlots[i][j];
      setSlots(newSlots);
    }
  };

  const handleExtend = () => {
    setExtended((state) => !state);
  };

  return (
    <div className={styles.container}>
      <h5>{tutor ? `${tutor}'s Schedule` : ""}</h5>
      <Button
        style={{ marginBottom: ".5rem" }}
        type="button"
        onClick={handleExtend}
      >
        {extended ? "Collapse" : "Expand"}
      </Button>
      <Table size="sm" bordered className="non-select">
        <tbody>
          <tr>
            {days.map((e) => (
              <th key={e}>{e}</th>
            ))}
          </tr>
          {times.map((time, i) => {
            if (extended || restrict(i)) {
              return (
                <tr key={i}>
                  {days.map((day, j) => (
                    <td
                      key={j}
                      style={
                        slots[i][j] == true
                          ? {
                              backgroundColor: themeColor.grey,
                              color: "white",
                            }
                          : {}
                      }
                      onMouseDown={tutor && handleMouseDown}
                      onMouseEnter={tutor && handleMouseEnter}
                      data-pos={[i, j]}
                    >
                      {time}
                    </td>
                  ))}
                </tr>
              );
            }
          })}
        </tbody>
      </Table>
    </div>
  );
}
