import styles from './timetable-style.module.css'
import {useMemo, useRef, useEffect} from 'react';
import {days, times} from '../utils'

export default function Timetable({tutor, slots, setSlots}) {
  const mouseDown = useRef(false);

  useEffect(() => {
    document.addEventListener("mouseup", HandleMouseUp)
  }, [])

  const handleMouseDown = (e) => {
    mouseDown.current = true;
    const [i,j] = e.target.dataset.pos.split(",");
    const newSlots =JSON.parse(JSON.stringify(slots));
    newSlots[i][j] = !newSlots[i][j];
    setSlots(newSlots);    
  };

  const HandleMouseUp = () => {
    mouseDown.current = false;
  }

  const handleMouseEnter = (e) => {
    if(mouseDown.current) {
      const [i,j] = e.target.dataset.pos.split(",");
      const newSlots = JSON.parse(JSON.stringify(slots));
      newSlots[i][j] = !newSlots[i][j];
      setSlots(newSlots);        
    }    
  }
  return (    
    <div className={styles.container}>
      <h2>{tutor? `${tutor}'s Schedule` : ''}</h2>
      <table className={styles.timetable}>
        <tbody>
          <tr>
            {days.map(e => <th key={e}>{e}</th>)}
          </tr>
          {times.map((time,i) => <tr key={i}>{days.map((day, j) => <td key={j} style={{backgroundColor: slots[i][j]==true?'grey':null}} onMouseDown={tutor && handleMouseDown} onMouseEnter={tutor && handleMouseEnter} data-pos={[i,j]}>{time}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
  )
}