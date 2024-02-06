import { useRef, useEffect, useState } from "react";
import readXlsxFile from "read-excel-file";
import { useSetStates } from "/src/hooks/customHooks.jsx";
import _ from "lodash";

import Button from "react-bootstrap/Button";

export default function Charts() {
  const fileInputRef = useRef();
  const refSetDates = useRef({});
  const startDate = useSetStates("startDate", refSetDates);
  const endDate = useSetStates("endDate", refSetDates);

  function handleUpload(e) {
    readXlsxFile(e.target.files[0]).then((rows) => {
      console.log(rows);
    });
  }

  function handleSelectDate(e) {
    const selectedDate = new Date(e.target.value);
    refSetDates.current[e.target.dataset.state](selectedDate);
  }

  useEffect(() => {
    console.log("start", startDate, "end", endDate);
    console.log(refSetDates.current);
  }); //remove

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

      {Object.keys(refSetDates.current).map((key) => (
        <span key={key} style={{ display: "inline-block" }}>
          <span>{_.startCase(key)}</span>
          <Button
            as="input"
            type="date"
            variant="outline-dark"
            data-state={key}
            onChange={handleSelectDate}
          />
        </span>
      ))}
    </div>
  );
}
