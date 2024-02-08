import { useRef, useEffect, useState } from "react";

import Progress from "/src/progress/Progress";
import Charts from "/src/dashboard/Charts";

export default function FrontendLab({ info, fetchInfo }) {
  return (
    <>
      <Charts />
      <Progress />
    </>
  );
}
