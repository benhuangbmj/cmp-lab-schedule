import Customers from "/src/classes/customers";

import { useRef, useEffect, useState } from "react";
import { useSetStates } from "/src/hooks/customHooks.jsx";
import Papa from "papaparse";
import _ from "lodash";
import dayjs from "dayjs";

import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import Button from "react-bootstrap/Button";

import UploadUsage from "/src/dashboard/UploadUsage";

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
    dayjs().subtract(6, "month").format("YYYY-MM-DD"),
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

  useEffect(() => {}, [plot]);

  return (
    <div style={{ height: "400px" }}>
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
      <UploadUsage />

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
      {fullData && (
        <ResponsiveContainer width="90%" height="100%">
          <BarChart
            className="designing"
            margin={{ bottom: 70, top: 10, right: 50 }}
            data={plot}
          >
            <CartesianGrid strokeDasharray="3" />
            <Bar dataKey="count" fill="#8884d8" />
            <XAxis dataKey="date" angle={60} textAnchor="start" />
            <YAxis
              domain={[0, fullData.yMax]}
              interval="PreserveEnd"
              tickCount={
                fullData.yMax < 10
                  ? fullData.yMax + 1
                  : Math.ceil((fullData.yMax + 1) / 2)
              }
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
