import {useState, useRef, useEffect} from 'react';
import {days, times} from '../util'
import {update} from '../api-operations';

import SelectTutor from '../util-components/SelectTutor';
import Timetable from './Timetable'


export default function Scheduling({info, fetchInfo}) {  
  const [slots, setSlots] = useState();
  const [selected, setSelected] = useState();
  const tutorSlots = useRef();
  
  const cleanSlate = Array.from(Array(13), () => Array.from(Array(4), ()=>false));

  const handleReset = () => {
    const resetSlots = Array.from(tutorSlots.current);
    setSlots(resetSlots);
  }

  const handleClear = () => {
    setSlots(cleanSlate);
  }

  const handleSelect = (option) => {
    if(option) {
      if(selected != option.value) {
        if(info[option.value].schedule) {
          setSlots(info[option.value].schedule);
          tutorSlots.current = JSON.parse(JSON.stringify(info[option.value].schedule));
        } else {
          setSlots(cleanSlate);
          tutorSlots.current = cleanSlate;
        }
        
        setSelected(option.value);
      }
    } else {
      setSelected();
    }
  };

  const handleUpdate = () => {
    const createSchedule = () => {
      const tutorDays = [];
      const tutorTimes = [];
      for(let j = 0; j < 4; j++) {
        let currTimes = '';
        let begin;
        let end;
        for(let i = 0; i < 13; i++) {
          if(slots[i][j]) {
            end = begin? times[i] : null;
            begin = begin? begin:times[i];
          } else if(begin) {
            currTimes += begin + ' - ' + end + '\n';
            begin = null;
            end = null;
          }
        }
        if(end) {
          currTimes += begin + ' - ' + end + '\n';
        }
        if (currTimes != '') {
          tutorTimes.push(currTimes);
          tutorDays.push(days[j]);
        }
      }
      const output = Object.assign(info[selected], {day: tutorDays, time: tutorTimes, schedule: slots});
      return output;
    }
    const data = createSchedule();
    update(selected, [], data, fetchInfo);
  };
  return (
      <>
        <SelectTutor info={info} handleSelect={handleSelect}/>
        {selected && <main>          
          <Timetable tutor={info[selected].name} slots={slots} setSlots = {setSlots}/>
          <button style={{display: 'inline-block'}}  onClick={handleUpdate}>Update</button>
          <button style={{display: 'inline-block'}}  onClick={handleReset}>Reset</button>
          <button style={{display: 'inline-block'}}  onClick={handleClear}>Clear</button>
        </main>} 
      </>     
  )
}