import './App.css';

import {io} from 'socket.io-client';
import { useState, useEffect, useCallback} from 'react';
import { Route, Routes, Link, NavLink } from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux';

import {selectTasks, updateTasks} from '/src/reducers/tasksReducer';
import {selectActive, updateActive} from '/src/reducers/activeReducer.js';
import {fetchUserData} from '/src/reducers/userDataReducer';

import {fetchInfo as preFetchInfo, fetchKey} from './api-operations.js'

import Schedule from './Schedule';
import Management from './Management';
import FrontendLab from './FrontendLab';
import LogIn from '/src/auth/LogIn';
import ProtectedRoute from '/src/utils/ProtectedRoute';
import SignOut from '/src/auth/SignOut';

const socket = io('https://backend-lab.manifold1985.repl.co', {
  autoConnect: false,
});

export default function App() {
  

  const [info, setInfo] = useState(null);
  const [courseTutor, setCourseTutor] = useState(null);
  const [shifts, setShifts] = useState(null);
  

  const active = useSelector(selectActive);

  const dispatch = useDispatch();

  const fetchInfo = useCallback(async () => {
    return preFetchInfo(setCourseTutor, setInfo, setShifts);
  }, []);

  const checkActive = async () => {
    console.log('Check active');//delete
    const cookieStr = document.cookie.split(';');
    const cookie = {};
    cookieStr.forEach(str => {
      const [key, value] = str.split('=');
      cookie[key.trim()] = value;
    });
    if(cookie.activeUser != null ) {
      const userStatus = await fetchKey(cookie.activeUser, 'status');
      if(userStatus.code == cookie.activeStatus) {
        dispatch(updateActive(cookie.activeUser));
        return;
      }
    }
    dispatch(updateActive(null));
  }
  
  useEffect(() => {
    if (!info) {
      console.log('no info');
      fetchInfo();
      dispatch(fetchUserData());
    }
    checkActive();
  }, []);

  /*
  useEffect(() => {
    socket.emit('fetchDisplay');
    socket.on('receiveDisplay', (data) => {
      dispatch(updateTasks(data));
    });
  },[]);
  */
  
  if (!info) {
    return (
      <main>
        <h1>Loading ...</h1>
      </main>
    )
  } else {
    return (
      <>
        <nav>
          <NavLink to="/">Schedule</NavLink> | <NavLink to="/management" >Manage</NavLink> | <NavLink to="/experimental">Experimental</NavLink>
          <div className='topnav-right'>
            {
              !active.user?
              <NavLink to='/login'>
                <button type='button'> Log in </button>  
              </NavLink> :
              <SignOut />
            }
          </div> 
        </nav>
        <Routes>
          <Route path='/' element={<Schedule shift={shifts} courses={courseTutor} />} />
          <Route path='/management'  element={
            <ProtectedRoute >
              <Management info={info} fetchInfo={fetchInfo}/>
            </ProtectedRoute>          
          } />
          <Route path='/experimental' element={
            <ProtectedRoute role='developer'> 
              < FrontendLab info={info} fetchInfo={fetchInfo} />
            </ProtectedRoute>
          }/>
          <Route path='/login' element={<LogIn />} />
        </Routes>
      </>
    )
  }
}