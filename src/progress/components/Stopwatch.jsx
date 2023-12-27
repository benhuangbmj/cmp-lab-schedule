import '/src/App.css';
import {useState, useEffect} from 'react';

export default function Stopwatch({taskId}) {
  const [isRunning, setIsRunning] = useState(false);
  const toggler = () => setIsRunning(isRunning => !isRunning);
  const handleStart = () => {
    toggler();
  }
  const handlePause = () => {
    toggler();
  }
  
  return(
    <>
      <button type='button' disabled={isRunning} onClick={handleStart}>Start</button>
      <button type='button' disabled={!isRunning} onClick={handlePause}>Pause</button>
      <button type='button'>Finish</button>
      <button type='button'>Resume</button>
    </>
  )
}