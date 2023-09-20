import './App.css';
import {useState, useEffect} from 'react';
const days = ['Monday', 'Tuesday','Wednesday','Thursday'];
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
function Schedule({shift}) {
  const currDate = new Date();
  return (
    <div>
      <h1>CMP Tutor Schedule<br/>{currDate.getMonth()>=6?"Fall":"Spring"} {currDate.getFullYear()}</h1>
      <table>
        <thead>
          <tr>
            {
              days.map(e => {
                return (
                  <th key = {e}>{e}</th>
                )
              })
            }
          </tr>
          <tr>
            {days.map((e, i) => {
              return (
                <Tutors key={e} info={shift[i]}/>
              )
            })}
          </tr>
        </thead>      
      </table>  
    </div>
            
  )
}

export default function App() {
  const [info, setInfo] = useState(null);
  
  useEffect(() => {
    const query = `{
      tutorsCollection {
        items {
          tutorInfo
        }
      }
    }`
    if(!info) {
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
         for(let student in tutorInfo) {
           const currInfo = tutorInfo[student];         
           for(let i = 0; i < currInfo.day.length; i++) {
            const day = currInfo.day[i];
            const index = days.indexOf(day);
            shift[index] += '\n'+ `${currInfo.name} (${currInfo.subject})` + '\n' + currInfo.time[i] + '\n';
           }        
         }
        shift.forEach((e, i, arr) => {
          arr[i] += '\n';
        })
         setInfo(shift); 
      });
    } else {
      console.log('Info ready'); //Development only. Delete for build.
    }    
  }, []);
  
  if (!info) {
    return (
      <main>
        Loading ...
      </main>
    )
  } else {
    return (
      <main>
        <Schedule shift={info}/>
      </main>
    )
  }
  
}
