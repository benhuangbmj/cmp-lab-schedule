import { useState, useEffect } from 'react';

const getTime = (seconds) => {
  let sec = seconds%60;
  const minutes = Math.floor(seconds/60); 
  let min = minutes%60;
  let hr = Math.floor(minutes/60);

  const addZero = (str) => {
    let output = str;
    if (str.length == 1) {
      output = '0' + str;
    }
    return output;      
  }

  sec = addZero(sec.toString());
  min = addZero(min.toString());

  const output = [hr.toString(), min, sec].join(":");
  return output;  
}

export default function Timelapse({ task }) {
  const calculateCumulative = () => {
    return task.in_progress? task.cumulative + (Date.now() - task.in_progress) : task.cumulative;
  };

  const [curr, setCurr] = useState(calculateCumulative());
  const [lapse, setLapse] = useState(getTime(curr))
  
  const displayedFields = ['task_id', 'task_name', 'user', 'type', 'created_at'];

  useEffect(() => {
    setLapse(getTime(Math.floor(curr/1000)));
  }, [curr]);  

  useEffect(() => {
    if (task.in_progress) {
      setCurr(calculateCumulative());
      const interval = setInterval(() => {
        setCurr(curr => curr + 1000);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [task]);

  return (
    <>
      {
        Object.keys(task).map(key => {
          if (displayedFields.includes(key)) {
            let value = task[key];
            if (key == 'created_at') {
              value = new Date(value).toLocaleString('en-US', {timeZone: 'America/New_York'});
            }
            return (
              <td key={key}>{value} </td>)
          }
        })
      }
      <td>{lapse}</td>
    </>
  )
}