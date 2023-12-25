import {useState, useEffect, useRef} from 'react';

export default function Timelapse({initial}) {
  const [curr, setCurr] = useState(initial);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurr(curr => curr + 1000);
    }, 1000)
  }, [])  

  return (
    <>
      <span>{Math.floor((curr - initial)/1000)}</span>
    </>
  )
}