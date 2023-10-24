import {useRef, useEffect, useState} from 'react';

import Scheduling from './scheduling/Scheduling'
import CardDisplay from './IDcard/CardDisplay';

  
export default function FrontendLab({info, fetchInfo}) {
  const [display, setDisplay] = useState('none');

  
  return(
    <>      
      <Scheduling info={info} fetchInfo={fetchInfo}  />
      
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
    </>
  )
}