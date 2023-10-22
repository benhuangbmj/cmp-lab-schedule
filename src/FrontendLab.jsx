import {useRef, useEffect, useState} from 'react';

import Scheduling from './scheduling/Scheduling'
import CardDisplay from './IDcard/CardDisplay';

import {icons} from './util';
  
export default function FrontendLab({info, fetchInfo}) {
  
  return(
    <>      
      <Scheduling info={info} fetchInfo={fetchInfo}  />      
      <div style={{width: '100%', height: '100vh'}}>
        <CardDisplay pageSize='LETTER' pageOrientation='portrait' info={info} toolbar={true}/>
      </div>      
    </>
  )
}