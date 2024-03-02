import '/src/App.css';
import {useState, useEffect} from 'react';

import Button from 'react-bootstrap/Button'; import ButtonGroup
from 'react-bootstrap/ButtonGroup'; import { FontAwesomeIcon }
from "@fortawesome/react-fontawesome"; import { faPlay, faStop, faPause,
faRetweet } from "@fortawesome/free-solid-svg-icons";

export default function Stopwatch({task, socket}) {
  const [isRunning, setIsRunning] = useState(task.in_progress != null);
  const [isComplete, setIsComplete] = useState(task.complete);

  const calculateCumulative = () => {
    return task.in_progress? task.cumulative + (Date.now() - task.in_progress) : task.cumulative;
  };
  
  const handleStart = () => {
    socket.emit('start', {
      task_id: task.task_id,
      in_progress: Date.now()
    })
  }
  const handlePause = () => {
    socket.emit('pause', {
      task_id: task.task_id,
      cumulative: calculateCumulative()
    });
  }

  const handleFinish = () => {
    socket.emit('finish', {
      task_id: task.task_id,
      cumulative: calculateCumulative(),
      in_progress: null,
      complete: 1
    });
  }

  const handleResume = () => {
    socket.emit('resume', {
      task_id: task.task_id,
      complete: 0,
      in_progress: Date.now()
    });
  }

  useEffect(() => {
    setIsRunning(task.in_progress != null);
    setIsComplete(task.complete);
  }, [task]);

  useEffect(() => {
    const handleUnload = () => {
      if(isRunning) {
        handlePause();
      }      
    }
    window.addEventListener('unload', handleUnload);
    return () => window.removeEventListener('unload', handleUnload);    
  }, []);
  
  return(
    <ButtonGroup size='sm'>
      <Button type='button' variant='success' disabled={isComplete || isRunning} onClick={handleStart}> <span className='button-text'>Start</span> <FontAwesomeIcon icon={faPlay} /></Button>
      <Button type='button' variant='dark' disabled={isComplete || !isRunning} onClick={handlePause}> <span className='button-text'>Pause</span> <FontAwesomeIcon icon={faPause} /> </Button>
      <Button type='button' variant='warning' disabled={isComplete} onClick={handleFinish}> <span className='button-text'>Complete</span> <FontAwesomeIcon icon={faStop} /></Button>
      <Button type='button' disabled={!isComplete} onClick={handleResume}> <span className='button-text'>Resume</span> <FontAwesomeIcon icon={faRetweet} /></Button>
    </ButtonGroup>
  )
}
