import { sortByLastName, days } from "./utils";

const spaceId = import.meta.env.VITE_SPACE_ID;
const cmaToken = import.meta.env.VITE_CMA_TOKEN;
const accessToken = import.meta.env.VITE_ACCESS_TOKEN;
const databaseId = import.meta.env.VITE_DATABASE_ID;
const backupId = import.meta.env.VITE_BACKUP_ID;
const userInfoId = import.meta.env.VITE_USER_INFO_ID;

const getSingleAsset = async function (assetId) {
  let asset = await fetch(
    `https://api.contentful.com/spaces/${spaceId}/environments/master/assets/${assetId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cmaToken}`,
      },
    },
  );
  asset = await asset.json();
  return asset;
};

const fetchInfo = (setCourseTutor, setInfo, setShifts, next) => {
  const query = `{
    tutorsCollection {
      items {
        tutorInfo
        sys {
          id
        }
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
    .then((res) => res.json())
    .then((res) => {
      const tutorInfo = res.data.tutorsCollection.items.find(
        (e, i) => e.sys.id == userInfoId,
      ).tutorInfo;
      const shift = Array.from(Array(4), () => Array.from(Array(2), () => []));
      const courseMap = new Map();
      for (let student in tutorInfo) {
        const currInfo = tutorInfo[student];
        delete currInfo.password;
        delete currInfo.resetPassword;

        for (let i = 0; i < currInfo.day.length; i++) {
          const day = currInfo.day[i];
          const index = days.indexOf(day);
          shift[index][0].push(
            `${currInfo.name} (${currInfo.subject})` + "\n" + currInfo.time[i],
          );
          currInfo.profilePic
            ? shift[index][1].push(currInfo.profilePic.url)
            : shift[index][1].push(null);
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
      });
      courses.sort();
      setCourseTutor(courses);
      setShifts(shift);
      setInfo(tutorInfo);
    })
    .then(() => {
      if (next) {
        next();
      }
    });
};

export const fetchKey = async (user, key) => {
  const query = `{
    tutorsCollection {
      items {
        tutorInfo
        sys {
          id
        }
      }
    }
  }`;
  let userData = await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${spaceId}/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ query }),
    },
  );
  userData = await userData.json();
  userData = userData.data.tutorsCollection.items.find(
    (e, i) => e.sys.id == userInfoId,
  ).tutorInfo[user];
  return userData[key];
};

const update = async (targetKey, keys, value, fetchInfo, backup = false) => {
  const entryId = backup ? backupId : databaseId;
  return fetch(
    `https://api.contentful.com//spaces/${spaceId}/environments/master/entries/${entryId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cmaToken}`,
      },
    },
  )
    .then((res) => res.json())
    .then((res) => {
      const currVersion = res.sys.version;
      if (targetKey != null) {
        let currLevel = res.fields.tutorInfo["en-US"];
        keys.forEach((e) => {
          currLevel = currLevel[e];
        });
        if (value) {
          currLevel[targetKey] = value;
        } else {
          delete currLevel[targetKey];
        }
      } else {
        Object.keys(value).forEach((user) => {
          Object.assign(res.fields.tutorInfo["en-US"][user], value[user]);
        });
      }
      fetch(
        `https://api.contentful.com//spaces/${spaceId}/environments/master/entries/${entryId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${cmaToken}`,
            "Content-Type": "application/vnd.contentful.management.v1+json",
            "X-Contentful-Version": currVersion,
          },
          body: JSON.stringify(res),
        },
      )
        .then((res) => res.json())
        .then((res) => {
          const newVersion = res.sys.version;
          fetch(
            `https://api.contentful.com//spaces/${spaceId}/environments/master/entries/${entryId}/published`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${cmaToken}`,
                "X-Contentful-Version": newVersion,
              },
            },
          ).then((res) => {
            if (res.ok) {
              fetchInfo &&
                fetchInfo().then(() => {
                  alert("Update user database successfully!");
                });
              return res.status;
            } else {
              alert("Update failed.");
              throw Error(res.status);
            }
          });
        });
    });
};
//changelog: update2_0 doesn't call fetchInfo.
export const update2_0 = async (targetKey, keys, value) => {
  const entryId = databaseId;
  let res = await fetch(
    `https://api.contentful.com//spaces/${spaceId}/environments/master/entries/${entryId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cmaToken}`,
      },
    },
  );
  res = await res.json();
  const currVersion = res.sys.version;
  if (targetKey != null) {
    let currLevel = res.fields.tutorInfo["en-US"];
    keys.forEach((e) => {
      currLevel = currLevel[e];
    });
    currLevel[targetKey] = value;
  } else {
    res.fields.tutorInfo["en-US"] = value;
  }
  res = await fetch(
    `https://api.contentful.com//spaces/${spaceId}/environments/master/entries/${entryId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${cmaToken}`,
        "Content-Type": "application/vnd.contentful.management.v1+json",
        "X-Contentful-Version": currVersion,
      },
      body: JSON.stringify(res),
    },
  );
  res = await res.json();
  const newVersion = res.sys.version;
  res = await fetch(
    `https://api.contentful.com//spaces/${spaceId}/environments/master/entries/${entryId}/published`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${cmaToken}`,
        "X-Contentful-Version": newVersion,
      },
    },
  );
  if (res.ok) {
    return res.status;
  } else {
    throw Error(res.status);
  }
};

//update3_0 uses object arguments and integrates the callback "next" compared to update. The async-await syntax is insignificant comparatively.
export const update3_0 = async ({
  targetKey,
  keys,
  value,
  fetchInfo,
  next,
}) => {
  const entryId = databaseId;
  let userData = await fetch(
    `https://api.contentful.com//spaces/${spaceId}/environments/master/entries/${entryId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cmaToken}`,
      },
    },
  );
  userData = await userData.json();

  const currVersion = userData.sys.version;
  if (targetKey != null) {
    let currLevel = userData.fields.tutorInfo["en-US"];
    keys.forEach((e) => {
      currLevel = currLevel[e];
    });
    if (value) {
      currLevel[targetKey] = value;
    } else {
      delete currLevel[targetKey];
    }
  } else {
    Object.keys(value).forEach((user) => {
      Object.assign(userData.fields.tutorInfo["en-US"][user], value[user]);
    });
  }
  let updatedData = await fetch(
    `https://api.contentful.com//spaces/${spaceId}/environments/master/entries/${entryId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${cmaToken}`,
        "Content-Type": "application/vnd.contentful.management.v1+json",
        "X-Contentful-Version": currVersion,
      },
      body: JSON.stringify(userData),
    },
  );
  updatedData = await updatedData.json();
  const newVersion = updatedData.sys.version;
  let publishedData = await fetch(
    `https://api.contentful.com//spaces/${spaceId}/environments/master/entries/${entryId}/published`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${cmaToken}`,
        "X-Contentful-Version": newVersion,
      },
    },
  );
  if (publishedData.ok) {
    if (fetchInfo) {
      fetchInfo(next).then(() => {
        alert("Update user database successfully!");
      });
    }
  } else {
    alert("Update failed.");
    throw Error(res.status);
  }
};
export const deleteAsset = async function (assetId) {
  let currAsset = await fetch(
    `https://api.contentful.com/spaces/${spaceId}/environments/master/assets/${assetId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cmaToken}`,
      },
    },
  );
  currAsset = await currAsset.json();
  const currVersion = currAsset.sys.version;
  const unpublished = await fetch(
    `https://api.contentful.com/spaces/${spaceId}/environments/master/assets/${assetId}/published`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${cmaToken}`,
        "X-Contentful-Version": currVersion,
      },
    },
  );
  if (unpublished.ok) {
    var deletedAsset = await fetch(
      `https://api.contentful.com/spaces/${spaceId}/environments/master/assets/${assetId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${cmaToken}`,
          "X-Contentful-Version": currVersion,
        },
      },
    );
    return deletedAsset;
  }
};

export const createAsset = async function (file, title) {
  let uploaded = await fetch(
    `https://upload.contentful.com/spaces/${spaceId}/uploads`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        Authorization: `Bearer ${cmaToken}`,
      },
      body: file,
    },
  );
  uploaded = await uploaded.json();
  const uploadedId = uploaded.sys.id;
  const resources = {
    fields: {
      title: {
        "en-US": title,
      },
      file: {
        "en-US": {
          contentType: file.type,
          fileName: file.name,
          uploadFrom: {
            sys: {
              type: "Link",
              linkType: "Upload",
              id: uploadedId,
            },
          },
        },
      },
    },
  };
  let created = await fetch(
    `https://api.contentful.com/spaces/${spaceId}/environments/master/assets`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        Authorization: `Bearer ${cmaToken}`,
      },
      body: JSON.stringify(resources),
    },
  );
  created = await created.json();
  const createdId = created.sys.id;
  const processed = await fetch(
    `https://api.contentful.com/spaces/${spaceId}/environments/master/assets/${createdId}/files/en-US/process`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${cmaToken}`,
        "X-Contentful-Version": 1,
      },
    },
  );
  if (processed.ok) {
    setTimeout(async () => {
      var published = await fetch(
        `https://api.contentful.com/spaces/${spaceId}/environments/master/assets/${createdId}/published`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${cmaToken}`,
            "X-Contentful-Version": 2,
          },
        },
      );
      if (published.ok) {
        alert("Change profile picture sucessfully!");
      } else {
        alert("Change profile picture failed");
      }
      const currAsset = await getSingleAsset(createdId);
      const currUrl = currAsset.fields.file["en-US"].url;
      const newProfile = {
        url: currUrl,
        id: createdId,
      };
      const res = await update2_0("profilePic", [title], newProfile);
    }, 1000);
  }
};

export { getSingleAsset, update, fetchInfo };

export default {
  update: update,
  update2_0: update2_0,
  fetchKey: fetchKey,
  deleteAsset: deleteAsset,
  createAsset: createAsset,
  update3_0,
};
