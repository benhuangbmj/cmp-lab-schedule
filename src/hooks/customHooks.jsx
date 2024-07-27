import React from "react";
import { AppContext } from "/src/contexts/AppContext";

export function useSetStates(name, ref, init = null) {
  const [state, setState] = React.useState(init);
  ref.current[name] = setState;
  return state;
}

export function useNormalizedBasePath() {
  const { basePath } = React.useContext(AppContext);
  const output =
    basePath[basePath.length - 1] == "/" ? basePath : basePath + "/";
  return output;
}
