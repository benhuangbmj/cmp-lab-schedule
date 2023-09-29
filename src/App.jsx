import './App.css';
import { useState, useEffect } from 'react';
import { Route, Routes, Link, NavLink } from "react-router-dom";
import Select from "react-select";
import {useForm} from 'react-hook-form';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'];
const spaceId = import.meta.env.VITE_SPACE_ID;
const accessToken = import.meta.env.VITE_ACCESS_TOKEN;
function Tutors(props) {
  return (
    <td>
      <pre>
        {props.info}
      </pre>
    </td>
  )
}
function Schedule({ shift, courses }) {
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

function Personnel({ courses }) {
  return (
    <div>
      <h3>Who can help you?</h3>
      <ul>{courses.map(e => (
        <li key={e}><pre>{e}</pre></li>
      ))}
      </ul>
    </div>


  )
}

function Management({ info }) {
  const options = [];
  Object.entries(info).forEach(e => {
    options.push({value: e[0], label: e[1].name});
  });
  const infoKeys = Array.from(Object.keys(Object.values(info)[0]));
  infoKeys.unshift('username');
  const {register,reset} = useForm();
  const [tutor, setTutor] = useState({});

  const handleSelect = (selected) => {
    reset(Object.assign({}, {username: selected.value}, info[selected.value]));
  }
  
  return (
    <main>
      <Select className = "select" options={options} onChange={handleSelect}/>
      <form>
        {infoKeys.map(e => 
      <p>
        <label>{e}: </label>
        <input type='text' name={e} {...register(e)}/>
      </p>
        )}      
      </form>
    </main>
  )
}

export default function App() {
  const [info, setInfo] = useState(null);
  const [courseTutor, setCourseTutor] = useState(null);
  const [shifts, setShifts] = useState(null);


  useEffect(() => {
    const query = `{
      tutorsCollection {
        items {
          tutorInfo
        }
      }
    }`
    if (!info) {
      fetch(`https://graphql.contentful.com/content/v1/spaces/${spaceId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ query }),
      })
        .then(res => res.json())
        .then(res => {
          const tutorInfo = res.data.tutorsCollection.items[0].tutorInfo;
          const shift = Array(4).fill("");
          const courseMap = new Map();
          for (let student in tutorInfo) {
            const currInfo = tutorInfo[student];
            //Make the shifts
            for (let i = 0; i < currInfo.day.length; i++) {
              const day = currInfo.day[i];
              const index = days.indexOf(day);
              shift[index] += '\n' + `${currInfo.name} (${currInfo.subject})` + '\n' + currInfo.time[i] + '\n';
            }
            //Making the course-tutor correspondence            
            for (let i = 0; i < currInfo.courses.length; i++) {
              if (!courseMap.has(currInfo.courses[i])) {
                courseMap.set(currInfo.courses[i], [currInfo.name]);
              } else {
                courseMap.get(currInfo.courses[i]).push(currInfo.name);
              }
            }
          }
          shift.forEach((e, i, arr) => {
            arr[i] += '\n';
          })
          const courses = [];
          courseMap.forEach((val, key) => {
            const str = key + ":  " + val.join(",     ");
            courses.push(str);
          })
          courses.sort();
          setCourseTutor(courses);
          setInfo(tutorInfo);
          setShifts(shift);
        });
    }
  }, []);

  if (!info) {
    return (
      <main>
        <h1>Loading ...</h1>
      </main>
    )
  } else {
    console.log('Info loaded'); //Development only. Delete for build.
    return (
      <>
        <nav>
          <NavLink to="/">Schedule</NavLink> | <NavLink to="/management">Manage</NavLink> 
        </nav>
        <Routes>
          <Route path='/' element={<Schedule shift={shifts} courses={courseTutor} />} />
          <Route path='/management' element={<Management info ={info} />}/>
        </Routes>      
      </>
      
    )
  }
}
