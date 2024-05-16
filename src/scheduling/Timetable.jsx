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
  const pointerDown = useRef(false);
  const [touchAction, setTouchAction] = useState("none");
  const [extended, setExtended] = useState(false);

  useEffect(() => {
    document.addEventListener("pointerup", HandlePointerUp);
  }, []);

  const handlePointerDown = (e) => {
    pointerDown.current = true;
    const [i, j] = e.target.dataset.pos.split(",");
    const newSlots = JSON.parse(JSON.stringify(slots));
    newSlots[i][j] = !newSlots[i][j];
    setSlots(newSlots);
  };

  const HandlePointerUp = () => {
    pointerDown.current = false;
  };

  const handlePointerEnter = (e) => {
    if (pointerDown.current) {
      const [i, j] = e.target.dataset.pos.split(",");
      const newSlots = JSON.parse(JSON.stringify(slots));
      newSlots[i][j] = !newSlots[i][j];
      setSlots(newSlots);
    }
  };

  const handleExtend = () => {
    setExtended((state) => !state);
  };

  function handleTouchStart(ev) {
    if (ev.touches.length > 1) {
      setTouchAction((state) => {
        switch (state) {
          case "none":
            return "auto";
            break;
          case "auto":
            return "none";
            break;
        }
      });
    }
  }

  function handleTouchEnd(ev) {}

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
      <Table
        size="sm"
        bordered
        className="non-select"
        style={{ touchAction: touchAction }}
      >
        <thead>
          <tr>
            {days.map((e) => (
              <th key={e}>{e}</th>
            ))}
          </tr>
        </thead>
        <tbody
          onPointerMove={(ev) => {
            if (ev.pointerType == "touch")
              ev.target.releasePointerCapture(ev.pointerId);
          }}
        >
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
                      onPointerDown={tutor && handlePointerDown}
                      onPointerEnter={tutor && handlePointerEnter}
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
