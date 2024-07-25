import { useRef, useEffect, useState, useContext } from "react";
import { useReactToPrint } from "react-to-print";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { days } from "/src/utils";
import { sortCriterionHelper } from "/src/utils";
import { useSelector } from "react-redux";
import Table from "react-bootstrap/Table";
import { AppContext } from "/src/contexts/AppContext";

import Charts from "/src/dashboard/Charts";

dayjs.extend(customParseFormat);
const currDate = new Date();

function parseTime(time) {
  return dayjs(time, "h:mm A");
}

function processUserInfo(info) {
  const combinedInfo = info[0].map((e, i) => [e, info[1][i]]);
  const timeRegEx = /\d+:\d+\s[AP]M/g;
  combinedInfo.sort((a, b) => {
    let [timeA, timeB] = [a[0].match(timeRegEx)[0], b[0].match(timeRegEx)[0]];
    [timeA, timeB] = [parseTime(timeA), parseTime(timeB)];
    if (sortCriterionHelper(timeA, timeB)) {
      return sortCriterionHelper(timeA, timeB);
    } else {
      [timeA, timeB] = [a[0].match(timeRegEx)[1], b[0].match(timeRegEx)[1]];
      [timeA, timeB] = [parseTime(timeA), parseTime(timeB)];
      return sortCriterionHelper(timeA, timeB);
    }
  });
  return combinedInfo;
}

export default function Schedule({ shift, courses }) {
  const [onScreen, setOnScreen] = useState("none");
  const { setNavbar } = useContext(AppContext);
  const activeUser = useSelector((state) => state.active.user);
  const userData = useSelector((state) => state.userData.items);
  const toPrint = useRef();
  const handlePrint = useReactToPrint({
    content: () => toPrint.current,
  });

  function handleToggleNavbar() {
    setNavbar((state) => !state);
  }

  useEffect(() => {
    if (userData && activeUser && userData[activeUser]?.roles.admin) {
      setOnScreen("initial");
    }
  }, [activeUser, userData]);

  return (
    <main>
      <div
        ref={toPrint}
        className="schedule-container letter-size flexbox-column"
        style={{ flexWrap: "nowrap" }}
      >
        <h1>
          <img
            className="qr-code"
            src="src/img/static-qr-code-6939aa416818b250434bfed8a036658a.png"
          />
          <div className="schedule-title">
            CMP Lounge Schedule
            <br />
            {currDate.getMonth() >= 6 ? "Fall" : "Spring"}{" "}
            {currDate.getFullYear()}
          </div>
          <img className="qr-code" src="src/img/qr-code.png" />
        </h1>
        <div>
          <Table bordered striped="columns" className="table-schedule">
            <thead>
              <tr>
                {days.map((e) => {
                  return (
                    <th key={e}>
                      <span className="institutional-navy">{e}</span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <Content info={shift} />
          </Table>
        </div>
        <div>
          <Personnel courses={courses} />
        </div>
      </div>
      <div className="schedule-operations">
        <button
          type="button"
          style={{ display: onScreen }}
          onClick={handlePrint}
        >
          Print the schedule
        </button>
        <button
          type="button"
          style={{ display: onScreen }}
          onClick={handleToggleNavbar}
        >
          Toggle navbar
        </button>
      </div>
    </main>
  );
}

function Tutor({ user }) {
  function getSubject(str) {
    const subjectRegEx = /(?<=\()[\w\W]*(?=\))/i;
    let subject = str.match(subjectRegEx)[0];
    subject = subject.replace("/", "-").toLowerCase();
    return subject;
  }
  return (
    <div className="flexbox-row schedule-cell">
      <div className="profile-pic-small">
        <img
          className="profilePic"
          src={
            user[1]
              ? user[1]
              : "https://www.messiah.edu/images/4_see_your_possibilities_anew.jpg"
          }
          style={!user[1] ? { objectFit: "contain" } : {}}
        />
      </div>
      <span className={getSubject(user[0]) + " preformatted shift"}>
        {user[0]}
      </span>
    </div>
  );
}

function Content({ info }) {
  const [amGroup, pmGroup] = [
    Array.from(Array(info.length), () => []),
    Array.from(Array(info.length), () => []),
  ];

  for (let i = 0; i < info.length; i++) {
    //Sort the users according to the start and end time.
    const combinedInfo = processUserInfo(info[i]);
    //

    //Split AM and PM groups.
    for (let j = 0; j < combinedInfo.length; j++) {
      function categorize(arr) {
        arr[i].push(combinedInfo[j]);
      }
      const tutor = combinedInfo[j];
      if (/\bAM\b/.test(tutor)) {
        categorize(amGroup);
      } else {
        categorize(pmGroup);
      }
    }
    //
  }
  return (
    <tbody>
      <tr>
        {amGroup.map((day, i) => {
          if (day.length > 0) {
            return (
              <td key={"am " + days[i]}>
                {day.map((user) => (
                  <Tutor key={user[0] + days[i]} user={user} />
                ))}
              </td>
            );
          } else {
            return (
              <td key={"pm " + days[i]} rowSpan="0">
                {pmGroup[i].map((user) => (
                  <Tutor key={user[0] + days[i]} user={user} />
                ))}
              </td>
            );
          }
        })}
      </tr>
      <tr>
        {pmGroup.map((day, i) => {
          if (day.length > 0 && amGroup[i].length > 0) {
            return (
              <td key={"pm " + days[i]}>
                {day.map((user) => (
                  <Tutor key={user[0] + days[i]} user={user} />
                ))}
              </td>
            );
          }
        })}
      </tr>
    </tbody>
  );
}

function Personnel({ courses }) {
  const subjects = ["CIS", "Math", "Physics", "Statistics"];
  const index = {
    CIS: 0,
    MATH: 1,
    PHYS: 2,
    STAT: 3,
  };
  const categories = [[], [], [], []];
  courses.forEach((e) => {
    const subject = e.match(/^\D+/)[0];
    categories[index[subject]].push(e);
  });
  return (
    <div>
      <h2
        style={{ margin: "auto", fontSize: "16pt", fontFamily: "Hand-of-Sean" }}
      >
        Who can help you?
      </h2>
      {categories.map((subject, i) => {
        return (
          <div className="personnel" key={subjects[i]}>
            <div className="flexbox-row" style={{ textAlign: "left" }}>
              <h3 className={subjects[i].toLowerCase() + " subject-title"}>
                {subjects[i]}
              </h3>
              <div className="divider-line"></div>
            </div>
            <div className="course-grid">
              {subject.map((e) => {
                const arr = e.split(":");
                return (
                  <span
                    key={e}
                    className={subjects[i].toLowerCase() + " preformatted"}
                    style={{ fontSize: "0.55em" }}
                  >
                    <strong>{arr[0]}</strong>:{arr[1]}{" "}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
