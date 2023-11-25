import {update} from '/src/api-operations';

export default function ResetPassword({disabled, user, fetchInfo}) {
  return (
    <button type='button' disabled={disabled} onClick={() => handleClick(user, fetchInfo)}>Reset Password</button>
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
  update('resetPassword', [user], verificationCode, fetchInfo);
}