import './App.css';

export default function Schedule({ shift, courses }) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  const currDate = new Date();
  return (
    <main>
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
          <tr>
            {days.map((e, i) => {
              return (
                <Tutors key={e} info={shift[i]} />
              )
            })}
          </tr>
        </thead>
      </table>
      <Personnel courses={courses} />
    </main>
  )
}

function Tutors({ info }) {
  return (
    <td>
      {info[0].map((e, i) =>
        <div className="left-align" key={e}>
          <img className='profile-pic-small' src={info[1][i]} />
          <pre>{e}</pre>
        </div>
      )}
    </td>
  )
}


function Personnel({ courses }) {
  return (
    <div>
      <h2 style={{ 'textAlign': 'left', 'paddingLeft': '1rem' }}>Who can help you?</h2>
      <ul>{courses.map(e => (
        <li key={e}><pre>{e}</pre></li>
      ))}
      </ul>
    </div>
  )
}