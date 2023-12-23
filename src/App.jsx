import './App.css';
import { useState, useEffect, useCallback} from 'react';
//import {sortByLastName} from './util';//delete
import { Route, Routes, Link, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import {fetchUserData} from './reducers/userDataReducer';

import {fetchInfo as preFetchInfo} from './api-operations.js'

import Schedule from './Schedule';
import Management from './Management';
import FrontendLab from './FrontendLab';

/*
const spaceId = import.meta.env.VITE_SPACE_ID;
const accessToken = import.meta.env.VITE_ACCESS_TOKEN;
const cmaToken = import.meta.env.VITE_CMA_TOKEN;

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'];
*/ //delete

export default function App() { 
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
      dispatch(fetchUserData());
    }
  }, []);
  
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