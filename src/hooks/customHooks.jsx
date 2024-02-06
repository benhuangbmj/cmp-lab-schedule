import { useState } from "react";

export function useSetStates(name, ref, init = null) {
  const [state, setState] = useState(init);
  ref.current[name] = setState;
  return state;
}
