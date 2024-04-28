import Customers from "/src/classes/customers";

import { useRef, useEffect, useState } from "react";
import { useSetStates } from "/src/hooks/customHooks.jsx";
import _ from "lodash";
import dayjs from "dayjs";

import { apiBaseUrl as base, subjects as subjectsObj } from "/src/utils";
import { themeColor as color } from "/src/config";

import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Text,
  Legend,
} from "recharts";

import Button from "react-bootstrap/Button";

let subjects = new Set(Object.values(subjectsObj));
subjects = Array.from(subjects);
subjects.sort();

export default function Charts() {
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

  function handleSelectDate(e) {
    refSetDates.current[e.target.dataset.state](e.target.value);
  }

  useEffect(() => {
    if (fullData) {
      fullData.setPlot(startDate, endDate);
      setPlot(fullData.getPlot());
    }
  }, [fullData, startDate, endDate]);

  useEffect(() => {
    (async () => {
      const url = new URL("usage", base);
      let usageData = await fetch(url);
      usageData = await usageData.json();
      if (usageData) {
        usageData = new Customers(usageData);
        setFullData(usageData);
      }
    })();
  }, []);

  return (
    <div className="centered">
      <h1>CMP Lounge Usage</h1>
      {Object.keys(refSetDates.current).map((key) => (
        <span key={key} style={{ display: "inline-block", margin: "1em 2em" }}>
          <span style={{ display: "inline-block", margin: "auto 1em" }}>
            {_.startCase(key)}
          </span>
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
      {plot && (
        <div className="centered chart-container" style={{ height: "300px" }}>
          <span className="chart-label">Total visits: {fullData.total}</span>
          {/*<span className="chart-label">Rating: {fullData.rating}</span>*/}
          <span className="chart-label">
            Distinct visitors: {fullData.distinct}
          </span>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart margin={{ bottom: 70, right: 50 }} data={plot.counts}>
              <CartesianGrid strokeDasharray="3" />
              <Bar dataKey="val" fill={color.institutional_navy} />
              <XAxis dataKey="date" angle={60} textAnchor="start" />
              <YAxis
                domain={[0, fullData.yMax]}
                label={{
                  value: "visits",
                  angle: -90,
                  position: "insideLeft",
                  offset: 20,
                  fontSize: 25,
                }}
                interval="PreserveEnd"
                tickCount={
                  fullData.yMax < 10
                    ? fullData.yMax + 1
                    : Math.ceil((fullData.yMax + 1) / 2)
                }
              />
            </BarChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart margin={{ bottom: 70, right: 50 }} data={plot.counts}>
              <Legend verticalAlign="top" align="right" />
              {subjects.map((e) => {
                return (
                  <Bar key={e} dataKey={e} stackId="subjects" fill={color[e]} />
                );
              })}
              <XAxis dataKey="date" angle={60} textAnchor="start" />
              <YAxis
                domain={[0, fullData.yMax]}
                label={{
                  value: "visits",
                  angle: -90,
                  position: "insideLeft",
                  offset: 20,
                  fontSize: 25,
                }}
                interval="PreserveEnd"
                tickCount={
                  fullData.yMax < 10
                    ? fullData.yMax + 1
                    : Math.ceil((fullData.yMax + 1) / 2)
                }
              />
            </BarChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              margin={{ bottom: 70, right: 50 }}
              data={plot.countsByDay}
            >
              <Legend verticalAlign="top" align="right" />
              {subjects.map((e) => {
                return (
                  <Bar
                    maxBarSize={20}
                    key={e}
                    dataKey={e}
                    stackId="subjects"
                    fill={color[e]}
                  />
                );
              })}
              <XAxis dataKey="day" angle={45} textAnchor="start" />
              <YAxis
                domain={[0, fullData.yMax]}
                label={{
                  value: "visits",
                  angle: -90,
                  position: "insideLeft",
                  offset: 20,
                  fontSize: 25,
                }}
                interval="PreserveEnd"
                tickCount={
                  fullData.yMax < 10
                    ? fullData.yMax + 1
                    : Math.ceil((fullData.yMax + 1) / 2)
                }
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
