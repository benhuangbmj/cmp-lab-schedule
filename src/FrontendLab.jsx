import {useRef, useEffect, useState} from 'react';

import Scheduling from './scheduling/Scheduling';
import CardDisplay from './IDcard/CardDisplay';
import Progress from '/src/progress/Progress';

const privilege = import.meta.env.VITE_PRIVILEGE;
  
export default function FrontendLab({info, fetchInfo}) {
  const [display, setDisplay] = useState('none');
    
  return (
    <>      
      <button 
        type='button' 
        onClick={() => {
          setDisplay('block');        
      }}>
        Show ID cards
      </button>
      <div style={{width: '100%', height: '100vh', display: display}}>
        <CardDisplay pageSize='LETTER' pageOrientation='portrait' info={info} toolbar={true}/>
      </div>
      <Progress />
    </>
  )
}