import './App.css'
const days = ['Monday', 'Tuesday','Wednesday','Thursday'];
const spaceId = import.meta.env.VITE_SPACE_ID;
const accessToken = import.meta.env.VITE_ACCESS_TOKEN;
function Tutors(props) {
  return (
    <td>
      {props.day}
    </td>
  )
}
function Schedule() {
  return (
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
          {days.map(e => {
            return (
              <Tutors key={e} day = {e}/>
            )
          })}
        </tr>
      </thead>      
    </table>          
  )
}

export default function App() {
  const query = `{
    tutorsCollection {
      items {
        tutorInfo
      }
    }
  }`
  fetch(`https://graphql.contentful.com/content/v1/spaces/${spaceId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ query }),
      })
    .then(res => res.json())
    .then(res => console.log(res.data.tutorsCollection.items[0].tutorInfo));
  return (
    <main>
      <Schedule />
    </main>
  )
}
