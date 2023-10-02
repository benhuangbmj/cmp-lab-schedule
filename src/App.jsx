import './App.css';
import { useState, useEffect } from 'react';
import { Route, Routes, Link, NavLink } from "react-router-dom";
import Select from "react-select";
import { useForm } from 'react-hook-form';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'];
const spaceId = import.meta.env.VITE_SPACE_ID;
const accessToken = import.meta.env.VITE_ACCESS_TOKEN;
const cmaToken = import.meta.env.VITE_CMA_TOKEN;

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
      <h2 style={{ 'textAlign': 'left', 'paddingLeft': '1rem' }}>Who can help you?</h2>
      <ul>{courses.map(e => (
        <li key={e}><pre>{e}</pre></li>
      ))}
      </ul>
    </div>


  )
}

function Management({ info, fetchInfo }) {
  const [newPic, setNewPic] = useState();
  const [uploadStatus, setUploadStatus] = useState('Upload');
  useEffect(() => {
    if (newPic) {
      const newPicURL = URL.createObjectURL(newPic);
      setProfile(newPicURL);
    }
  }, [newPic]);
  function ChangeProfile() {
    function handleChangeProfile(e) {
      setNewPic(e.target.files[0]);
    }
    function uploadPic() {
      setUploadStatus('Uploading ...');
      const deleteAsset = async function(assetId) {
        let currAsset = await fetch(`https://api.contentful.com/spaces/${spaceId}/environments/master/assets/${assetId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${cmaToken}`
          }
        });
        currAsset = await currAsset.json();
        const currVersion = currAsset.sys.version;
        await fetch(`https://api.contentful.com/spaces/${spaceId}/environments/master/assets/${assetId}/published`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${cmaToken}`,
            "X-Contentful-Version": currVersion,
          }
        });
        let deletedAsset = await fetch(`https://api.contentful.com/spaces/${spaceId}/environments/master/assets/${assetId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${cmaToken}`,
            "X-Contentful-Version": currVersion,
          }
        });
      }
      const createAsset = async function(file, title) {
        let uploaded = await fetch(`https://upload.contentful.com/spaces/${spaceId}/uploads`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/octet-stream",
            Authorization: `Bearer ${cmaToken}`
          },
          body: file,
        });
        uploaded = await uploaded.json();
        const uploadedId = uploaded.sys.id;
        const resources = {
          "fields": {
            "title": {
              "en-US": title
            },
            "file": {
              "en-US": {
                "contentType": file.type,
                "fileName": file.name,
                "uploadFrom": {
                  "sys": {
                    "type": "Link",
                    "linkType": "Upload",
                    "id": uploadedId,
                  }
                }
              }
            }
          }
        }
        let created = await fetch(`https://api.contentful.com/spaces/${spaceId}/environments/master/assets`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/octet-stream",
            Authorization: `Bearer ${cmaToken}`
          },
          body: JSON.stringify(resources),
        });
        created = await created.json();
        const createdId = created.sys.id;
        const processed = await fetch(`https://api.contentful.com/spaces/${spaceId}/environments/master/assets/${createdId}/files/en-US/process`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${cmaToken}`,
            "X-Contentful-Version": 1
          }
        });
        if (processed.ok) {          
          setTimeout(async () => {
            var published = await fetch(`https://api.contentful.com/spaces/${spaceId}/environments/master/assets/${createdId}/published`, {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${cmaToken}`,
                "X-Contentful-Version": 2,
              }
            });
            if (published.ok) {
              alert("Change profile picture sucessfully!");              
            } else {
              alert("Change profile picture failed");
            }
            setUploadStatus('Upload');
          }, 1000);
        }
      }
      const tutor = info[selected];
      if (tutor.profilePic) {
        //deleteAsset(tutor.profilePic.id);
        createAsset(newPic, selected);
      } else {
        console.log('No');
      }
    }
    return (
      <span>
        <label>Change Profile Picture </label>
        <input type='file' accept='image/*' onChange={handleChangeProfile} />
        <button className="file-input-button" onClick={uploadPic}>{uploadStatus}</button>
      </span>
    )
  }

  const courseOptions = ['MATH102', 'MATH107', 'MATH108', 'MATH111', 'MATH112', 'MATH190', 'MATH198', 'MATH211', 'MATH261', 'MATH270', 'MATH308', 'STAT269', 'STAT292', 'STAT281'];
  const options = [];
  const skip = ['courses', 'profilePic'];

  Object.entries(info).forEach(e => {
    options.push({ value: e[0], label: e[1].name });
  });
  const isFieldArray = (key) => {
    return Array.isArray(Object.values(info)[0][key]);
  };

  const infoKeys = Array.from(Object.keys(Object.values(info)[0]));
  infoKeys.unshift('username');

  const { register, reset, handleSubmit } = useForm();

  const [profile, setProfile] = useState();
  const [selected, setSelected] = useState();

  const onSubmit = (data) => {
    for (let key in data) {
      if (isFieldArray(key) && typeof data[key] === 'string') {
        data[key] = data[key].split(',');
      }
    }
    const username = data.username;
    delete data.username;

    const update = () => {
      fetch(`https://api.contentful.com//spaces/${spaceId}/environments/master/entries/UIushXQv9bsjZ5hAWxmUz`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${cmaToken}`
        }
      })
        .then(res => res.json())
        .then(res => {
          const currVersion = res.sys.version;
          res.fields.tutorInfo['en-US'][username] = data;
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
    update();
  }
  const handleSelect = (selected) => {
    setProfile();
    setSelected(selected.value);
    if (info[selected.value].profilePic) {
      setProfile(info[selected.value].profilePic.url);
    }
    const initialVal = Object.assign({}, { username: selected.value }, info[selected.value]);
    reset(initialVal);
  }
  const testFunc = function() {
    fetch(`https://api.contentful.com/spaces/${spaceId}/environments/master/assets/2XM90i0ghRTEiQIXHl7V6G`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cmaToken}`,
      }
    }).then(res => res.json()).then(res => console.log(res));
  }

  return (
    <main>
      <label>Select tutor </label>
      <Select className="select" options={options} onChange={handleSelect} />
      <div className='profile-container'>{profile ? <img className="profilePic" src={profile} /> : <div style={{ marginTop: "35px" }}>profile picture</div>}</div>
      <ChangeProfile />
      <form onSubmit={handleSubmit(onSubmit)}>
        {infoKeys.map(e => {
          if (!skip.includes(e)) {
            return (
              <p key={e}>
                <label>{e}: </label>
                <input type='text' name={e} {...register(e)} />
              </p>
            )
          }
        }
        )}
        <p>
          <label>courses: </label>
          {courseOptions.map(e => <span key={e}><input type='checkbox' label={e} value={e} {...register('courses')} /><label className='small-label'>{e} </label></span>)}
        </p>
        <button type='submit'>Update</button>
      </form>
      <button onClick={testFunc}>Test</button>
    </main>
  )
}

export default function App() {
  const [info, setInfo] = useState(null);
  const [courseTutor, setCourseTutor] = useState(null);
  const [shifts, setShifts] = useState(null);

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
          val.sort((a, b) => {
            a = a.split(" ")[1];
            b = b.split(" ")[1];
            if (a <= b) {
              return -1;
            } else {
              return 1;
            }
          });
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
  /*
    useEffect(() => {
      fetch(`https://api.contentful.com//spaces/${spaceId}/environments/master/assets/N9gEB61AGIwayN76JMl1x`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${cmaToken}`,
        }
      })
      .then(res => res.json())
      .then(res => console.log(res));
    }, []);
  */
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
          <Route path='/management' element={<Management info={info} fetchInfo={fetchInfo} />} />
        </Routes>
      </>

    )
  }
}
