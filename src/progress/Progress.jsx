import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectTasks, updateTasks } from '/src/reducers/tasksReducer.js';

import Timelapse from './components/Timelapse';
import CreateTask from './components/CreateTask';
import Stopwatch from './components/Stopwatch';

const socket = io('https://backend-lab.manifold1985.repl.co', {
  autoConnect: false,
});

export default function Progress() {
  const tasks = useSelector(selectTasks);
  const activeUser = useSelector(state => state.active.user);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.connect();
    return () => socket.disconnect();
  })
  
  return (
    <>
      <CreateTask />
      <button type='button' onClick={() => {
        socket.emit('fetchTasks', activeUser);
        socket.on('receiveTasks', (data) => {
          dispatch(updateTasks(data));
        });
      }} >Load Tasks</button>
      {
        tasks &&
        <div>
          {
            tasks.map((task, i) => {
              return (
                <p key={i}>
                  <Timelapse task={task} />
                  <Stopwatch task={task} socket={socket} />
                </p>
              )
            })
          }
        </div>
      }
    </>
  )
}