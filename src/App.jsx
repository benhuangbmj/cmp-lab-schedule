import './App.css';

import utils from '/src/utils';

import { useState, useEffect, useCallback} from 'react';
import { Route, Routes, Link, NavLink } from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux';

import {selectActive, updateActive} from '/src/reducers/activeReducer.js';
import {fetchUserData} from '/src/reducers/userDataReducer';

import {fetchInfo as preFetchInfo, fetchKey} from './api-operations.js'

import Schedule from './Schedule';
import Profile from './profile/Profile';
import FrontendLab from './FrontendLab';
import LogIn from '/src/auth/LogIn';
import ProtectedRoute from '/src/utils/ProtectedRoute';
import SignOut from '/src/auth/SignOut';
import Admin from '/src/admin/Admin';

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
      fetchInfo();
      dispatch(fetchUserData());
    }
    checkActive();
  }, []);
  
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
          <NavLink to="/">Schedule</NavLink> | <NavLink to="/profile" >Profile</NavLink> | <NavLink to="/admin">Administration</NavLink> |<NavLink to="/experimental">Experimental</NavLink>
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
          <Route path='/profile'  element={
            <ProtectedRoute >
              <Profile info={info} fetchInfo={fetchInfo}/>
            </ProtectedRoute>          
          } />
          <Route path='/admin' element={
            <ProtectedRoute role='admin'>
              <Admin />
            </ProtectedRoute>
          } />
          <Route path='/experimental' element={
            <ProtectedRoute role='developer'> 
              <FrontendLab info={info} fetchInfo={fetchInfo} />
            </ProtectedRoute>
          }/>
          <Route path='/login' element={<LogIn />} />
        </Routes>
      </>
    )
  }
}