import { useRef, useEffect, useState } from "react";
import readXlsxFile from "read-excel-file";
import { useSetStates } from "/src/hooks/customHooks.jsx";

import Button from "react-bootstrap/Button";

export default function Charts() {
  const fileInputRef = useRef();
  const refSetStates = useRef({});
  const endDate = useSetStates('setEndDate', 'today', refSetStates.current);

  function handleUpload(e) {
    readXlsxFile(e.target.files[0]).then((rows) => {
      console.log(rows);
    });
  }
  
  function handleSelectDate(e) {
    const selectedDate = new Date(e.target.value);
    refSetStates.current[e.target.dataset.set_state](selectedDate);
  }

  return (
    <div>
      <Button
        className="center-fit"
        onClick={() => fileInputRef.current?.click()}
      >
        Upload the data file
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        className="non-display"
        onChange={handleUpload}
      />
      <span>Start date</span>
      <Button
        as="input"
        type="date"
        variant="outline-dark"
        onChange={handleSelectDate}
      />
      <span>End date</span>
      <Button
        as="input"
        type="date"
        variant="outline-dark"
        data-set_state={"setEndDate"}
        onChange={handleSelectDate}
      />
    </div>
  );
}
