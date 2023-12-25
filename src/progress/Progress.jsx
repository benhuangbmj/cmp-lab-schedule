import {io} from 'socket.io-client';
import {useEffect, useState} from 'react';

import Timelapse from './components/Timelapse';

const socket = io('https://backend-lab.manifold1985.repl.co');

export default function Progress() {
  const [message, setMessage] = useState('');
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket.io connected.');
    });
    socket.on('output', (msg) => {
      console.log('output: ', msg);
      setMessage(msg);
    })
    socket.on('initilize', (msg) => {
      setMessage(msg);
    })
  }, []);
  return (
    <>
      <input type='text' onChange={(e) => {
        socket.emit('input', e.target.value);
      }}/>
      <span>{message}</span>
      <Timelapse initial = {Date.now()} />
    </>
  )
}