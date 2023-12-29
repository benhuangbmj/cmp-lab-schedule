import {useState, useRef} from 'react';

import {update} from '/src/api-operations';
import sendEmail from './sendEmail';
import {generateVerificationCode} from '/src/util.js';
import Popup from 'reactjs-popup';
import bcrypt from 'bcryptjs';
import 'reactjs-popup/dist/index.css';


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

const handleSubmit = (info, user, value, fetchInfo) => {
  const verified = info[user].resetPassword.code == value && new Date() - info[user].resetPassword.generatedTime < 1000*60*15;
  if(verified) {
    const initialPassword = bcrypt.hashSync(user, 10);
    update('password', [user], initialPassword, fetchInfo);
  } else {
    alert('The verification code you entered is incorrect or it has past the validation time.');
  }
}