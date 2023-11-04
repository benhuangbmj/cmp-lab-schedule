import './App.css';
import { forwardRef, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

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
      </div>
      <button type='button' onClick={handlePrint}>Print the schedule</button>
    </main>
  )
};

function Tutors({ info }) {
  return (
    <td>
      {info[0].map((e, i) =>
        <div className="left-align" key={e}>
          <div className='profile-pic-small'>
            <img className="profilePic" src={info[1][i] ? info[1][i] : 'https://www.messiah.edu/images/4_see_your_possibilities_anew.jpg'} />
          </div>
          <pre>{e}</pre>
        </div>
      )}
    </td>
  )
}


function Personnel({ courses }) {
  return (
    <div >
      <h2 style={{ 'textAlign': 'left', 'paddingLeft': '1rem' }}>Who can help you?</h2>
      <ul>{courses.map(e => (
        <li key={e}><pre>{e}</pre></li>
      ))}
      </ul>
    </div>
  )
}

export default Schedule;