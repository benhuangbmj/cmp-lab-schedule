import utils, { getTaskStatus } from "/src/utils";
import * as config from "/src/config.js";

import { io } from "socket.io-client";
import {
  useEffect,
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectTasks, updateTasks } from "/src/reducers/tasksReducer.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePen, faTrashCan } from "@fortawesome/free-solid-svg-icons";

import Table from "react-bootstrap/Table";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";

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
  const [descending, setDescending] = useState("task_id");
  const dispatch = useDispatch();
  const refTasks = useRef();
  const [initiate, setInitiate] = useState(true);
  const refTaskMap = useRef(new Map());

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
      refTasks.current = sortedTasks;
      dispatch(updateTasks(Array.from(tasks)));
    }
  };

  function handleDeleteTask(taskId) {
    if (confirm("Are you going to permanently delete the task?")) {
      fetch(utils.apiBaseUrl + "/delete-task", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: taskId,
      });
    }
  }

  useEffect(() => {
    try {
      socket.connect();
      socket.on("receiveTasks", (data) => {
        const myData = Array.from(data);
        myData.sort((a, b) => a.task_id - b.task_id);
        setInitiate(true);
        dispatch(updateTasks(myData));
      });
      socket.on("taskUpdated", () => socket.emit("fetchTasks", activeUser));
      socket.emit("fetchTasks", activeUser);
    } catch (err) {
      console.log(err);
    }
    return () => socket.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (initiate && tasks) {
      refTasks.current = Array.from(tasks);
      tasks.forEach((task, i) => {
        refTaskMap.current.set(task.task_id, i);
      });
      setInitiate(false);
    }
  }, [tasks, initiate]);

  return (
    <>
      <CreateTask />
      {!initiate && (
        <Table
          style={{ textAlign: "center" }}
          borderless
          striped
          responsive
          size="sm"
        >
          <thead>
            <tr>
              <th></th>
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
          <tbody tasks={tasks}>
            {refTasks.current.map((task, i) => {
              return (
                <tr key={i}>
                  <td>
                    <ButtonGroup size="sm" vertical={config.mediaQuery.matches}>
                      <Button type="button" variant="info">
                        <FontAwesomeIcon icon={faFilePen} />
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteTask(task.task_id)}
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </Button>
                    </ButtonGroup>
                  </td>
                  <Timelapse
                    taskMap={refTaskMap.current}
                    tasks={tasks}
                    refTask={task}
                    displayedFields={displayedFields}
                    shownOnMobile={shownOnMobile}
                  />
                  <td>
                    <Stopwatch
                      taskMap={refTaskMap.current}
                      tasks={tasks}
                      refTask={task}
                      socket={socket}
                    />
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
