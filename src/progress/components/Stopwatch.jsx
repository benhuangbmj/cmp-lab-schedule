import '/src/App.css';
import {useState, useEffect} from 'react';

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
    <>
      <button type='button' disabled={isComplete || isRunning} onClick={handleStart}>Start</button>
      <button type='button' disabled={isComplete || !isRunning} onClick={handlePause}>Pause</button>
      <button type='button' disabled={isComplete} onClick={handleFinish}>Finish</button>
      <button type='button' disabled={!isComplete} onClick={handleResume}>Resume</button>
    </>
  )
}