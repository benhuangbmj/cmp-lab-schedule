import './App.css';
import { useState, useEffect } from 'react';
import {sortByLastName} from './util';
import { Route, Routes, Link, NavLink } from "react-router-dom";

import Schedule from './Schedule';
import Management from './Management';

const spaceId = import.meta.env.VITE_SPACE_ID;
const accessToken = import.meta.env.VITE_ACCESS_TOKEN;
const cmaToken = import.meta.env.VITE_CMA_TOKEN;

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'];

export default function App() {
  const update = (targetKey, keys, value) => {      
    fetch(`https://api.contentful.com//spaces/${spaceId}/environments/master/entries/UIushXQv9bsjZ5hAWxmUz`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cmaToken}`
      }
    })
      .then(res => res.json())
      .then(res => {
        const currVersion = res.sys.version;
        let currLevel = res.fields.tutorInfo['en-US'];
        keys.forEach(e => {
          currLevel = currLevel[e];
        });
        currLevel[targetKey] = value;
        fetch(`https://api.contentful.com//spaces/${spaceId}/environments/master/entries/UIushXQv9bsjZ5hAWxmUz`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${cmaToken}`,
            "Content-Type": 'application/vnd.contentful.management.v1+json',
            "X-Contentful-Version": currVersion,
          },
          body: JSON.stringify(res),
        })
          .then(res => res.json())
          .then(res => {
            const newVersion = res.sys.version;
            fetch(`https://api.contentful.com//spaces/${spaceId}/environments/master/entries/UIushXQv9bsjZ5hAWxmUz/published`, {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${cmaToken}`,
                "X-Contentful-Version": newVersion,
              },
            }).then(res => {
              if (res.ok) {
                fetchInfo();
                alert('Update tutor information successfully!');                
              } else {
                alert('Update failed.')
              }
            });
          });
      });
  };
  
  const [info, setInfo] = useState(null);
  const [courseTutor, setCourseTutor] = useState(null);
  const [shifts, setShifts] = useState(null);
  const [rerender, setRerender] = useState(0);

  const fetchInfo = () => {
    const query = `{
      tutorsCollection {
        items {
          tutorInfo
        }
      }
    }`;
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
        const shift = Array.from(Array(4), () => Array.from(Array(2), () => []));
        const courseMap = new Map();
        for (let student in tutorInfo) {
          const currInfo = tutorInfo[student];
          //Make the shifts
          for (let i = 0; i < currInfo.day.length; i++) {
            const day = currInfo.day[i];
            const index = days.indexOf(day);
            shift[index][0].push(`${currInfo.name} (${currInfo.subject})` + '\n' + currInfo.time[i]);
            currInfo.profilePic ? shift[index][1].push(currInfo.profilePic.url) : shift[index][1].push(null);
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
        const courses = [];
        courseMap.forEach((val, key) => {
          sortByLastName(val, []);
          const str = key + ":  " + val.join(",  ");
          courses.push(str);
        })
        courses.sort();
        setCourseTutor(courses);
        setInfo(tutorInfo);
        setShifts(shift);
      });
  }

  useEffect(() => {
    if (!info) {
      fetchInfo();
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
          <Route path='/management' element={<Management info={info} update={update} key={rerender} setRerender={setRerender} />} />
        </Routes>
      </>
    )
  }
}
