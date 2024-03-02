import { useState, useEffect } from 'react';

import ProgressBar from 'react-bootstrap/ProgressBar';

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

export default function Timelapse({ task, displayedFields, shownOnMobile }) {
  const calculateCumulative = () => {
    return task.in_progress? task.cumulative + (Date.now() - task.in_progress) : task.cumulative;
  };

  const [curr, setCurr] = useState(calculateCumulative());
  const [lapse, setLapse] = useState(getTime(curr))

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
              <td key={key} className={!shownOnMobile.includes(key)? 'hidden-on-mobile' : ''}>{value} </td>)
          }
        })
      }
      <td>{lapse} <ProgressBar now={curr/1000/108}/></td>
    </>
  )
}