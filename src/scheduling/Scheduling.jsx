import {useState, useRef, useEffect} from 'react';

import Timetable from './Timetable'
const tutorSlots = Array.from(Array(13), () => Array.from(Array(4), ()=>false));
tutorSlots[1][0] = true;


export default function Scheduling() {
  
  
  const [slots, setSlots] = useState();
  
  useEffect(() => {
    setSlots(tutorSlots);
  }, [])

  const handleReset = () => {
    const resetSlots = Array.from(tutorSlots);
    setSlots(resetSlots);
  }

  const handleClear = () => {
    const clearSlots = Array.from(Array(13), () => Array.from(Array(4), ()=>false));
    setSlots(clearSlots);
  }
  return (
      <>
        {slots && <main>
          <Timetable tutor={'Mock Tutor'} slots={slots} setSlots = {setSlots}/>          
          <button style={{display: 'inline-block'}}  onClick={handleReset}>Reset</button>
          <button style={{display: 'inline-block'}}  onClick={handleClear}>Clear</button>
        </main>} 
      </>     
  )
}