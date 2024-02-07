import { useRef, useEffect, useState } from "react";
import { useSetStates } from "/src/hooks/customHooks.jsx";
import Papa from "papaparse";
import _ from "lodash";

import Button from "react-bootstrap/Button";

const headers = [
  "id",
  "starTime",
  "completionTime",
  "email",
  "name",
  "username",
  "courses",
  "rating",
  "feedback",
  "words",
];

export default function Charts() {
  const fileInputRef = useRef();
  const refSetDates = useRef({});
  const startDate = useSetStates("startDate", refSetDates);
  const endDate = useSetStates("endDate", refSetDates);

  function handleUpload(e) {
    Papa.parse(e.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        console.log(results);
      },
      transformHeader: function (header, i) {
        return headers[i];
      },
    });
  }

  function handleSelectDate(e) {
    const selectedDate = new Date(e.target.value);
    refSetDates.current[e.target.dataset.state](selectedDate);
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
        accept=".csv"
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
