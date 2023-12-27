import {io} from 'socket.io-client';
import {useEffect, useState} from 'react';

import Timelapse from './components/Timelapse';
import CreateTask from './components/CreateTask';
import Stopwatch from './components/Stopwatch';

const socket = io('https://backend-lab.manifold1985.repl.co');

export default function Progress() {
  const [display, setDisplay] = useState();
  
  return (
    <>
      <CreateTask />
      <Stopwatch />
    </>
  )
}