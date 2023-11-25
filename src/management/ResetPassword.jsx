import {useState, useRef} from 'react';

import {update} from '/src/api-operations';
import sendEmail from './sendEmail';
import Popup from 'reactjs-popup';
import bcrypt from 'bcryptjs';
import 'reactjs-popup/dist/index.css';

export default function ResetPassword({disabled, user, fetchInfo, info}) {
  const [open,setOpen] = useState(true);
  const codeEntered = useRef();
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

const handleClick = (user, fetchInfo) => {
  const verificationCode = generateVerificationCode();
  console.log(verificationCode);//delete
  update('resetPassword', [user], verificationCode, fetchInfo);//resume
  const body = verificationCode.code;//Extend
  sendEmail(user, body);//Create the function
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