import './App.css';
import {io} from 'socket.io-client';
import { useState, useEffect, useCallback} from 'react';
import { Route, Routes, Link, NavLink } from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux';
import {selectTasks, updateTasks} from '/src/reducers/tasksReducer';

import {fetchInfo as preFetchInfo} from './api-operations.js'


import Schedule from './Schedule';
import Management from './Management';
import FrontendLab from './FrontendLab';

export default function App() {
  const socket = io('https://backend-lab.manifold1985.repl.co');

  const [info, setInfo] = useState(null);
  const [courseTutor, setCourseTutor] = useState(null);
  const [shifts, setShifts] = useState(null);
  const [passed, setPassed] = useState(false);

  const dispatch = useDispatch();

  const fetchInfo = useCallback(async () => {
    return preFetchInfo(setCourseTutor, setInfo, setShifts);
  }, []);
  
  useEffect(() => {
    if (!info) {
      fetchInfo();
    }
  }, []);

  useEffect(() => {
    socket.emit('fetchDisplay');
    socket.on('receiveDisplay', (data) => {
      dispatch(updateTasks(data));
    });
  },[]);

  useEffect(() => {
    if(info) console.log(info.bhuang);
  }, [info]);//delete
  
  if (!info) {
    return (
      <main>
        <h1>Loading ...</h1>
      </main>
    )
  } else {
    console.log('Info loaded'); //Development only. Delete for build.
    return (
      <>
        <nav>
          <NavLink to="/">Schedule</NavLink> | <NavLink to="/management">Manage</NavLink> | <NavLink to="/experimental">Experimental</NavLink>
        </nav>
        <Routes>
          <Route path='/' element={<Schedule shift={shifts} courses={courseTutor} />} />
          <Route path='/management' element={<Management info={info} fetchInfo={fetchInfo}/>} />
          <Route path='/experimental' element={< FrontendLab info={info} fetchInfo={fetchInfo} passed={passed} setPassed = {setPassed} />}/>
        </Routes>
      </>
    )
  }
}