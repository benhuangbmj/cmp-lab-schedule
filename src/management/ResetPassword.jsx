import {useState, useRef} from 'react';
//import {useSelector, useDispatch} from "react-redux";
//import {fetchData} from '/src/reducers/userDataReducer';

import {update} from '/src/api-operations';
import sendEmail from './sendEmail';
import Popup from 'reactjs-popup';
import bcrypt from 'bcryptjs';
import emailjs from '@emailjs/browser';
import 'reactjs-popup/dist/index.css';

//fix: rename the variables
const templateId = import.meta.env.VITE_EMAIL_TEMPLATE_ID;
const emailjsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const serviceId = import.meta.env.VITE_EMAIL_SERVICE_ID;

export default function ResetPassword({disabled, user, fetchInfo, info}) {
  const [open,setOpen] = useState(false);
  const codeEntered = useRef();

  const handleClick = (user, fetchInfo) => {
    const verificationCode = generateVerificationCode();
    update('resetPassword', [user], verificationCode, fetchInfo);
    const body = `
    Here is the verification code to reset your passowrd: ${verificationCode.code}. This code will expire in 15 minutes;  
    `;
    sendEmail(user, body);
    setOpen(true);
  }
  
  return (
    <>
      <button type='button' disabled={disabled} onClick={() => handleClick(user, fetchInfo)}>Reset Password</button>
      <button type='button' onClick={()=>setOpen(true)}>Open</button>{//delete
      }
      
      <Popup open={open} closeOnDocumentClick={false}>
      <div className='modal'>
        <label>Please enter your verification code: </label>
        <input ref={codeEntered} />
        <button type='button' onClick={() => handleSubmit(info, user, codeEntered.current.value, fetchInfo)}>Submit</button>
        <button type='button' onClick={() => setOpen(false)}>Close</button>
      </div>
      </Popup>
    </>
  )
}

const generateVerificationCode = () => {
  const codeArr = Array(4).fill();
  codeArr.forEach((e,i) => {
    codeArr[i] = Math.floor(Math.random() * 10);    
  });
  const code = codeArr.join('');
  const output = {
    code: code,
    generatedTime: new Date().getTime()
  };
  return output;
}

const handleSubmit = (info, user, value, fetchInfo) => {
  const verified = info[user].resetPassword.code == value && new Date() - info[user].resetPassword.generatedTime < 1000*60*15;
  if(verified) {
    const initialPassword = bcrypt.hashSync(user, 10);
    update('password', [user], initialPassword, fetchInfo);
  } else {
    alert('The verification code you entered is incorrect or it has past the validation time.');
  }
}