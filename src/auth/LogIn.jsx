import '/src/App.css';

import bcrypt from 'bcryptjs';

import { generateVerificationCode } from '/src/utils.js';
import { update2_0 } from '/src/api-operations.js';
import {fetchKey} from '/src/api-operations.js';

import {useEffect, useState} from 'react';
import { useForm } from 'react-hook-form';
import {useSelector, useDispatch} from 'react-redux';
import {selectUserData} from '/src/reducers/userDataReducer.js';
import {selectActive, updateActive} from '/src/reducers/activeReducer.js';
import {useLocation, Navigate} from 'react-router-dom';


import ResetPassword from './ResetPassword';




export default function LogIn() {
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    reset: resetLogin,
    formState: {errors: errorsLogin},
  } = useForm();
  const dispatch = useDispatch();

  const [redirect, setRedirect] = useState(false);

  const userData = useSelector(selectUserData).items;
  const active = useSelector(selectActive);
  const location = useLocation();

  const getExpires = () => {
    const now = Date.now();
    const exp = new Date(now + (5*24*3600*1000));
    return exp.toUTCString();
  }

  const handleVerify = (username, verified) => {
    if (verified) {
      alert(`Log in successfully, ${userData[username].name}!`);
      dispatch(updateActive(username));
      const status = generateVerificationCode(33);
      update2_0('status', [username], status).then(() => {          
        const result = status.code;
        document.cookie=`activeUser=${username}; expires=${getExpires()}`;
        document.cookie=`activeStatus=${result}; expires=${getExpires()}`;
      }).catch(err => console.log("Log in error: ", err));
    } else {
      alert('Invalid credential!');
    }
    
  }
  
  const handleLogin = async (data) => {
    if (userData.hasOwnProperty(data.username)) {
      const currPassword = await fetchKey(data.username, 'password');
      if(currPassword != null) {
        const verified = bcrypt.compareSync(data.password, currPassword);       
        handleVerify(data.username, verified);              
      } else {
        handleVerify(data.username, data.password === data.username)        
      }  
    }
    /*
    if(info[selected].password) {
      const verified = bcrypt.compareSync(data.password, currPassword);
      if(!verified) {
        alert('Invalid password.');
        return;
      } else {
        alert('Log in successfully!');
        setLoggedIn(true);
        const now = new Date();
        sendEmail('bhuang', `User ${selected} logged in at ${now.toLocaleString("en-US", {timeZone: "America/New_York"})}.`)

      }
    }
    displayInfo(selected);    
    */
  };

  const handleRedirect = () => {
    setRedirect(true);
  }
  
  return (
    <div className="login">
      { !active.user?
        <>
          <form onSubmit={handleSubmitLogin(handleLogin)}>
            <label>Username</label>
            <input style={{marginTop: '1rem'}} type='text' name='username' {...registerLogin('username', {required: 'Please enter your username.'})}/>
            <label>Password: </label>
            <input style={{marginTop: '1rem'}} type='password' name='password' {...registerLogin('password', {required: 'Please enter your password.'})}/>        
            <button type='submit'>Submit</button>
            {/*<ResetPassword disabled={selected == null} user={selected} fetchInfo={fetchInfo} info={info}/>*/}
          </form>
          <ResetPassword />
          {/*errorsLogin.pw? <p className='errorMessage'>{errorsLogin.pw.message}</p> : <p className='errorMessage'>&nbsp;</p> <-- what is this?*/}
            {Object.keys(errorsLogin).map(key => <p key={key} className='errorMessage'>{errorsLogin[key].message}</p>)}
        </> :
        <div>
          Log in successfully, {userData[active.user].name}!
        </div>
      }
      {location.state && active.user && <button type='button' onClick={handleRedirect}>Go back to the previous page</button>}
      {redirect && <Navigate to={location.state.from.pathname} />}
    </div>
  )
}

/*
1. Show the last log in time
*/