import { sortByLastName, days } from './util'

const spaceId = import.meta.env.VITE_SPACE_ID;
const cmaToken = import.meta.env.VITE_CMA_TOKEN;
const accessToken = import.meta.env.VITE_ACCESS_TOKEN;
const databaseId = import.meta.env.VITE_DATABASE_ID;
const backupId = import.meta.env.VITE_BACKUP_ID;

const getSingleAsset = async function(assetId) {
  let asset = await fetch(`https://api.contentful.com/spaces/${spaceId}/environments/master/assets/${assetId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${cmaToken}`,
    }
  });
  asset = await asset.json();
  return asset;
}

const fetchInfo = (setCourseTutor, setInfo, setShifts) => {
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

        for (let i = 0; i < currInfo.day.length; i++) {
          const day = currInfo.day[i];
          const index = days.indexOf(day);
          shift[index][0].push(`${currInfo.name} (${currInfo.subject})` + '\n' + currInfo.time[i]);
          currInfo.profilePic ? shift[index][1].push(currInfo.profilePic.url) : shift[index][1].push(null);
        }

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
      setShifts(shift);
      setInfo(tutorInfo);
    });
}

const update = async (targetKey, keys, value, fetchInfo, backup=false) => {
  const entryId = backup? backupId:databaseId;
  return fetch(`https://api.contentful.com//spaces/${spaceId}/environments/master/entries/${entryId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${cmaToken}`
    }
  })
    .then(res => res.json())
    .then(res => {
      const currVersion = res.sys.version;      
      if(targetKey != null) {
        let currLevel = res.fields.tutorInfo['en-US'];
        keys.forEach(e => {
          currLevel = currLevel[e];
        });
        currLevel[targetKey] = value;
      } else {
        res.fields.tutorInfo['en-US'] = value;
      }
      fetch(`https://api.contentful.com//spaces/${spaceId}/environments/master/entries/${entryId}`, {
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
          fetch(`https://api.contentful.com//spaces/${spaceId}/environments/master/entries/${entryId}/published`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${cmaToken}`,
              "X-Contentful-Version": newVersion,
            },
          }).then(res => {
            if (res.ok) {
              fetchInfo().then(() => {
                alert('Update tutor information successfully!');
              });
            } else {
              alert('Update failed.')
            }
          });
        });
    });
};

export { getSingleAsset, update, fetchInfo };