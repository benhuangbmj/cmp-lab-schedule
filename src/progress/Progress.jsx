import utils, { getTaskStatus } from "/src/utils";

import { io } from "socket.io-client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectTasks, updateTasks } from "/src/reducers/tasksReducer.js";

import Table from "react-bootstrap/Table";

import Timelapse from "./components/Timelapse";
import CreateTask from "./components/CreateTask";
import Stopwatch from "./components/Stopwatch";

const socket = io(utils.apiBaseUrl, {
  autoConnect: false,
});

const displayedFields = [
  "task_id",
  "task_name",
  "user",
  "type",
  "in_progress",
  "created_at",
  "progress",
];
const onScreenHeaders = [
  "ID",
  "Title",
  "Assigned To",
  "Type",
  "Status",
  "Created At",
  "Progress",
];
const shownOnMobile = ["task_id", "task_name", "in_progress", "progress"];

export default function Progress() {
  const tasks = useSelector(selectTasks);
  const activeUser = useSelector((state) => state.active.user);
  const [descending, setDescending] = useState();
  const dispatch = useDispatch();

  const sortByField = (field) => {
    if (tasks[0].hasOwnProperty(field)) {
      const sign = descending == field ? -1 : 1;
      if (sign == -1) {
        setDescending();
      } else {
        setDescending(field);
      }
      var sortedTasks = tasks.toSorted((a, b) => {
        if (field == "in_progress") {
          var [c, d] = [getTaskStatus(a), getTaskStatus(b)];
        } else {
          var [c, d] = [a[field], b[field]];
        }
        if (c < d) return sign * -1;
        if (c > d) return sign * 1;
        return 0;
      });
      dispatch(updateTasks(sortedTasks));
    }
  };

  useEffect(() => {
    try {
      socket.connect();
      socket.on("receiveTasks", (data) => {
        data.sort((a, b) => a.task_id - b.task_id);
        dispatch(updateTasks(data));
      });
      socket.on("taskUpdated", () => socket.emit("fetchTasks", activeUser));
    } catch (err) {
      console.log(err);
    }
    return () => socket.disconnect();
  }, []);

  return (
    <>
      <CreateTask />
      <button
        type="button"
        onClick={() => socket.emit("fetchTasks", activeUser)}
      >
        Load Tasks
      </button>
      <button
        type="button"
        onClick={() => {
          socket.disconnect();
        }}
      >
        disconnect
      </button>
      {tasks && (
        <Table
          style={{ textAlign: "center" }}
          borderless
          striped
          responsive
          size="sm"
        >
          <thead>
            <tr>
              {displayedFields.map((e, i) => (
                <th
                  key={i}
                  className={
                    !shownOnMobile.includes(e) ? "hidden-on-mobile" : ""
                  }
                  onClick={() => {
                    sortByField(e);
                  }}
                >
                  {onScreenHeaders[i]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, i) => {
              return (
                <tr key={i}>
                  <Timelapse
                    task={task}
                    displayedFields={displayedFields}
                    shownOnMobile={shownOnMobile}
                  />
                  <td>
                    <Stopwatch task={task} socket={socket} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </>
  );
}
