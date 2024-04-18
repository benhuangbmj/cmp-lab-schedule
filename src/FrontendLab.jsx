import { useRef, useEffect, useState } from "react";
import SelectSupervisors from "/src/admin/components/SelectSupervisors";

export default function FrontendLab({ info, fetchInfo }) {
  return (
    <>
      <SelectSupervisors user={"bhuang"} />
    </>
  );
}
