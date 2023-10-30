import {useRef, useEffect, useState} from 'react';

import Scheduling from './scheduling/Scheduling';
import CardDisplay from './IDcard/CardDisplay';

const privilege = import.meta.env.VITE_PRIVILEGE;
  
export default function FrontendLab({info, fetchInfo, passed, setPassed}) {
  const [display, setDisplay] = useState('none');

  useEffect(() => {
    if(!passed) {
      const currPass = prompt('What\'s your pass?');
      setPassed(currPass === privilege);
    }
  }, []);
    
  return (
    passed === true?
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
    </> : passed === false?
    <div>
      <h1>Invalid pass</h1>
    </div> : null
  )
}