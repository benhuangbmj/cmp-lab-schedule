import './App.css';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {sortCriterionHelper} from '/src/utils';
dayjs.extend(customParseFormat);

function parseTime(time) {
  return dayjs(time, 'h:mm A');
}

function processUserInfo(info) {
  const combinedInfo = info[0].map((e, i) => [e, info[1][i]]);
  const timeRegEx = /\d+:\d+\s[AP]M/g;
  combinedInfo.sort((a, b) => {
    let [timeA, timeB] = [a[0].match(timeRegEx)[0], b[0].match(timeRegEx)[0]];
    [timeA, timeB] = [parseTime(timeA) ,parseTime(timeB)];
    if(sortCriterionHelper(timeA, timeB)) {
      return sortCriterionHelper(timeA, timeB);
    } else {      
      [timeA, timeB] = [a[0].match(timeRegEx)[1], b[0].match(timeRegEx)[1]];
      [timeA, timeB] = [parseTime(timeA) ,parseTime(timeB)];      
      return sortCriterionHelper(timeA, timeB);
    }
  });
  return combinedInfo;
}

const Schedule = ({ shift, courses }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  const currDate = new Date();
  const toPrint = useRef();
  const handlePrint = useReactToPrint({
    content: () => toPrint.current
  })
  return (
    <main>
      <div ref={toPrint} style={{ textAlign: 'center' }}>
        <h1>CMP Tutor Schedule<br />{currDate.getMonth() >= 6 ? "Fall" : "Spring"} {currDate.getFullYear()}</h1>
        <table>
          <thead>
            <tr>
              {
                days.map(e => {
                  return (
                    <th key={e}>{e}</th>
                  )
                })
              }
            </tr>
          </thead>
          <tbody>
            <tr>
              {days.map((e, i) => {
                return (
                  <Tutors key={e} info={shift[i]} />
                )
              })}
            </tr>
          </tbody>
        </table>
        <Personnel courses={courses} />
        <p>Follow us on social media</p>
        <img className='qr-code' src='src/img/static-qr-code-6939aa416818b250434bfed8a036658a.png' />
        <img className='qr-code' src='src/img/qr-code.png' />
      </div>
      <button type='button' onClick={handlePrint}>Print the schedule</button>
    </main>
  )
};

function Tutors({ info }) { 
  const [amGroup, pmGroup] = [[], []];

  //Sort the users according to the start and end time.
  const combinedInfo = processUserInfo(info);

  const n = combinedInfo.length;

  //Split AM and PM groups. 
  for(let i = 0; i < n; i++) {
    function categorize(arr) {
      arr.push(combinedInfo[i]);
    }
    const tutor = combinedInfo[i][0];
    if(/\bAM\b/.test(tutor)) {
      categorize(amGroup);
    } else {
      categorize(pmGroup);
    }
  }
  function Populate({info}) {
    return (
      <>   
        {info.map((e, i) =>
          <div className="left-align" key={e[0]}>
            <div className='profile-pic-small'>
              <img className="profilePic" src={e[1] ? e[1] : 'https://www.messiah.edu/images/4_see_your_possibilities_anew.jpg'} />
            </div>
            <pre>{e[0]}</pre>
          </div>
        )}
      </>
    )
  }
  return (
    <td>
      <Populate info={amGroup} />
      {amGroup.length>0 && <div style={{height:'2pt', backgroundColor:'black'}}></div>}   
      <Populate info={pmGroup} />
    </td>
  )
}


function Personnel({ courses }) {
  return (
    <div>
      <h2 style={{ 'textAlign': 'left', 'paddingLeft': '1rem' }}>Who can help you?</h2>
      <div className="course-grid">
        {courses.map(e => {
          const arr = e.split(':');
          return (
            <pre key={e} style={{ width: '100%', textAlign: 'left', height: "100%" }}><strong>{arr[0]}</strong>:{arr[1]} </pre>
          )
        })}
      </div>
    </div>
  )
}

export default Schedule;