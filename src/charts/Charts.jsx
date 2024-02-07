import { useRef, useEffect, useState } from "react";
import { useSetStates } from "/src/hooks/customHooks.jsx";
import Papa from "papaparse";
import _ from "lodash";

import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import Button from "react-bootstrap/Button";

const headers = [
  "id",
  "startTime",
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
  const [dataPoints, setDataPoints] = useState();

  function handleUpload(e) {
    Papa.parse(e.target.files[0], {
      header: true,
      transformHeader: function (header, i) {
        return headers[i];
      },
      skipEmptyLines: true,
      complete: function (results) {
        const counts = new Map();
        results.data.forEach((user) => {
          const date = new Date(user.startTime);
          const dateStr = date.toDateString();
          const count = counts.get(dateStr);
          if (count) {
            counts.set(dateStr, count + 1);
          } else {
            counts.set(dateStr, 1);
          }
        });
        const countsArr = [];
        counts.forEach((val, key) => {
          countsArr.push({
            date: key,
            count: val,
          });
        });
        setDataPoints(countsArr);
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
      <LineChart width={1500} height={500} data={dataPoints}>
        <Line type="monotone" dataKey="count" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="date" />
        <YAxis />
      </LineChart>
    </div>
  );
}
