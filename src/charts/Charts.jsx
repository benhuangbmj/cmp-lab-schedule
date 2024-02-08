import Customers from "/src/classes/customers";

import { useRef, useEffect, useState } from "react";
import { useSetStates } from "/src/hooks/customHooks.jsx";
import Papa from "papaparse";
import _ from "lodash";
import dayjs from "dayjs";

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
  const startDate = useSetStates(
    "startDate",
    refSetDates,
    dayjs().year() - 1 + "-01-01",
  );
  const endDate = useSetStates(
    "endDate",
    refSetDates,
    dayjs().format("YYYY-MM-DD"),
  );
  const [fullData, setFullData] = useState();
  const [plot, setPlot] = useState();

  function handleUpload(e) {
    Papa.parse(e.target.files[0], {
      header: true,
      transformHeader: function (header, i) {
        return headers[i];
      },
      skipEmptyLines: true,
      complete: function (results) {
        const customers = new Customers(results, { setPlot: setPlot });
        setFullData(customers);
      },
    });
  }

  function handleSelectDate(e) {
    refSetDates.current[e.target.dataset.state](e.target.value);
  }

  useEffect(() => {
    if (fullData) {
      fullData.setPlot(startDate, endDate);
      setPlot(fullData.getPlot());
    }
  }, [fullData, startDate, endDate]);

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
            value={eval(key)}
            onChange={handleSelectDate}
          />
        </span>
      ))}
      <LineChart width={500} height={500} data={plot}>
        <Line type="monotone" dataKey="count" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="date" />
        <YAxis />
      </LineChart>
    </div>
  );
}
