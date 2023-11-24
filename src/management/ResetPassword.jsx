export default function ResetPassword() {
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

  console.log(generateVerificationCode());
  
  return (
    <button type='button'>Reset Password</button>
  )
}