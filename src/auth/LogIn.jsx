import '/src/App.css';

import bcrypt from 'bcryptjs';

import {useEffect} from 'react';
import { useForm } from 'react-hook-form';
import {useSelector, useDispatch} from 'react-redux';
import {selectUserData} from '/src/reducers/userDataReducer.js';
import {selectActive, updateActive} from '/src/reducers/activeReducer.js';

import {fetchPassword} from '/src/api-operations.js';

export default function LogIn() {
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    reset: resetLogin,
    formState: {errors: errorsLogin},
    watch: watchLogin
  } = useForm();
  const dispatch = useDispatch();

  const currUser = watchLogin('username');
  const userData = useSelector(selectUserData).items;
  const active = useSelector(selectActive);
  
  const handleLogin = async (data) => {
    if (userData.hasOwnProperty(currUser)) {
      const currPassword = await fetchPassword(currUser);
      if(currPassword != null) {
        const verified = bcrypt.compareSync(data.password, currPassword);
        if(!verified) {
          alert('Invalid password.');
          return;
        } else {
          alert('Log in successfully!');
          dispatch(updateActive(data.username));
        }        
      } else {
        if(data.password === data.username) {
          alert('Log in successfully!');
        } else {
          alert('Invalid password.');
        }
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
  
  return (
    <div className="login">
      <form onSubmit={handleSubmitLogin(handleLogin)}>
        <label>Username</label>
        <input style={{marginTop: '1rem'}} type='text' name='username' {...registerLogin('username', {required: 'Please enter your username.'})}/>
        <label>Password: </label>
        <input style={{marginTop: '1rem'}} type='password' name='password' {...registerLogin('password', {required: 'Please enter your password.'})}/>        
        <button type='submit'>Submit</button>
        {/*<ResetPassword disabled={selected == null} user={selected} fetchInfo={fetchInfo} info={info}/>*/}
      </form>      
      {/*errorsLogin.pw? <p className='errorMessage'>{errorsLogin.pw.message}</p> : <p className='errorMessage'>&nbsp;</p> <-- what is this?*/}
      {Object.keys(errorsLogin).map(key => <p key={key} className='errorMessage'>{errorsLogin[key].message}</p>)
      }
    </div>
  )
}

/*
1. Show the last log in time
*/