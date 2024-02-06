import { useState } from 'react';

export function useSetStates(name, init, setStates) {
  const [state, setState] = useState(init);
  setStates[name] = setState;
  return state;
}