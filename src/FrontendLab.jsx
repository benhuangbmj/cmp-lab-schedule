import React from "react";
import { AppContext } from "/src/contexts/AppContext";
export default function FrontendLab() {
  const { navHeight, info, fetchInfo } = React.useContext(AppContext);
  return (
    <main>
      <h1>Hello Front-end Lab!</h1>
    </main>
  );
}
