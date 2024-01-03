import utils from '/src/util'

import { io } from 'socket.io-client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectTasks, updateTasks } from '/src/reducers/tasksReducer.js';

import Timelapse from './components/Timelapse';
import CreateTask from './components/CreateTask';
import Stopwatch from './components/Stopwatch';

const socket = io(utils.apiBaseUrl, {
  autoConnect: false,
});

const displayedFields = ['task_id', 'task_name', 'user', 'type', 'created_at', 'progress', 'operations'];



export default function Progress() {
  const tasks = useSelector(selectTasks);
  const activeUser = useSelector(state => state.active.user);
  const [descending, setDescending] = useState();
  const dispatch = useDispatch();

  const sortByField = useCallback((field) => {
    if (tasks[0].hasOwnProperty(field)) {
      const sign = descending == field? -1 : 1;
      if (sign == -1) {
        setDescending();
      } else {
        setDescending(field);
      }
      const sortedTasks = tasks.toSorted((a,b) => {
        const [c,d] = [a[field], b[field]];
        if (c < d) return sign*-1;
        if (c > d) return sign*1;
        return 0;
      });
      dispatch(updateTasks(sortedTasks));
    }
  }, [tasks]);

  useEffect(() => {
    socket.connect();
    socket.on('receiveTasks', data => {
      data.sort((a,b) => a.task_id - b.task_id);
      dispatch(updateTasks(data));
    });
    socket.on('taskUpdated', () => socket.emit('fetchTasks', activeUser));
    return () => socket.disconnect();
  }, [])

  return (
    <>
      <CreateTask />
      <button type='button' onClick={() => socket.emit('fetchTasks', activeUser)} >Load Tasks</button>
      <button type='button' onClick={() =>{socket.disconnect()}}>disconnect</button>
      {
        tasks &&
        <table>
          <thead>
            <tr>
              {displayedFields.map((e,i) => <th key={i} onClick={() => {sortByField(e)}} >{e}</th>)}
            </tr>
          </thead>
          <tbody>
            {
              tasks.map((task, i) => {
                return (
                  <tr key={i}>
                    <Timelapse task={task} />
                    <td><Stopwatch task={task} socket={socket} /></td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      }
    </>
  )
}