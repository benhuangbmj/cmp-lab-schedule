import { sortByLastName, days } from "./utils.js";
import * as preContentful from "contentful";
import * as dotenv from "dotenv";
if (typeof process != "undefined") {
  dotenv.config({ path: "../../.env.local" });
  var contentful = preContentful.default;
} else {
  var contentful = preContentful;
}

const myEnv = import.meta.env || process.env;

const spaceId = myEnv.VITE_SPACE_ID;
const cmaToken = myEnv.VITE_CMA_TOKEN;
const accessToken = myEnv.VITE_ACCESS_TOKEN;
const databaseId = myEnv.VITE_DATABASE_ID;
const backupId = myEnv.VITE_BACKUP_ID;
const userInfoIdDefault = myEnv.VITE_USER_INFO_ID; //to distinguish from other JSON file (e.g. the backup file)
const deptInfoId = myEnv.VITE_DEPT_INFO_ID;
export const client = contentful.createClient({
  accessToken: accessToken,
  space: spaceId,
});

export async function getDeptInfo() {
  const entry = await client.getEntry(deptInfoId);
  const deptInfo = entry.fields.deptInfo;
  return deptInfo;
}

export const getSingleAsset = async function (assetId) {
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

export const fetchInfo = (
  setCourseTutor,
  setInfo,
  setShifts,
  next = () => {},
  showBoundary = () => {},
  userInfoId = userInfoIdDefault,
) => {
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
    .then((res) => {
      if (res.ok) return res.json();
      else {
        throw Error("Something went wrong. Please try again later.");
      }
    })
    .then((res) => {
      const tutorInfo = res.data.tutorsCollection.items.find(
        (e, i) => e.sys.id == userInfoId,
      ).tutorInfo;
      const shift = Array.from(Array(4), () => Array.from(Array(2), () => []));
      const courseMap = new Map();
      const aliasMap = new Map();
      Object.keys(tutorInfo)
        .filter((username) =>
          myEnv.PROD
            ? !tutorInfo[username].inactive
            : !tutorInfo[username].permission && !tutorInfo[username].inactive,
        )
        .forEach((username, i) => {
          aliasMap.set(username, `Tutor ${i + 1}`);
        });
      for (let student in tutorInfo) {
        const currInfo = tutorInfo[student];
        if (currInfo.inactive) continue;
        delete currInfo.password;
        delete currInfo.resetPassword;
        const tutorName = aliasMap.get(student) || currInfo.name;
        const profilePic = aliasMap.has(student)
          ? null
          : currInfo.profilePic
            ? currInfo.profilePic.url
            : null;

        for (let i = 0; i < currInfo.day.length; i++) {
          const day = currInfo.day[i];
          const index = days.indexOf(day);
          shift[index][0].push(
            `${tutorName}\n (${currInfo.subject})` + "\n" + currInfo.time[i],
          );
          shift[index][1].push(profilePic);
        }

        for (let i = 0; i < currInfo.courses.length; i++) {
          if (!courseMap.has(currInfo.courses[i])) {
            courseMap.set(currInfo.courses[i], [tutorName]);
          } else {
            courseMap.get(currInfo.courses[i]).push(tutorName);
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
    })
    .catch((err) => {
      const myError = new Error(
        "Something went wrong. Please try again later. If the error persists, please contact your administrator.",
      );
      showBoundary(myError);
      console.log(err);
    });
};

export const fetchKey = async (user, key, userInfoId = userInfoIdDefault) => {
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

export const update = async (
  targetKey,
  keys,
  value,
  fetchInfo,
  backup = false,
) => {
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
export const update2_0 = async (
  targetKey,
  keys,
  value,
  entryId = databaseId,
) => {
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
    return await res.json();
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
  next = () => {},
  entryId = databaseId,
}) => {
  const fetchUserData = () =>
    fetch(
      `https://api.contentful.com//spaces/${spaceId}/environments/master/entries/${entryId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cmaToken}`,
        },
      },
    );
  let userData = await fetchUserData();
  if (!userData.ok) {
    alert("Update failed.");
    throw Error(userData.status);
  }
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
  if (!updatedData.ok) {
    alert("Update failed.");
    throw Error(updatedData.status);
  }
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
  if (!publishedData.ok) {
    alert("Update failed.");
    throw Error(publishedData.status);
  }
  publishedData = await publishedData.json();
  userData = await (await fetchUserData())?.json?.();
  if (userData?.sys?.version == publishedData.sys.version) {
    if (typeof fetchInfo == "function") {
      await fetchInfo(next);
      alert("Update user database successfully!");
    }
  }
  return publishedData;
};
export const deleteAsset = async function (assetId) {
  if (!assetId) return;
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

export const createAsset = async function (
  file,
  title,
  userInfoId = userInfoIdDefault,
) {
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
    const result = await new Promise((resolve, reject) =>
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
        const res = await update2_0(
          "profilePic",
          [title],
          newProfile,
          userInfoId,
        );
        resolve(res);
      }, 1000),
    );
    return result;
  }
};

export async function fetchDeptInfoById(id) {
  const deptInfo = await getDeptInfo();
  return deptInfo[id];
}

export class Contentful {
  constructor(userInfoId = userInfoIdDefault) {
    this.createAsset = async function (file, title) {
      return createAsset(file, title, userInfoId);
    };
    this.deleteAsset = deleteAsset;
  }
}

export default {
  update,
  update2_0,
  fetchKey,
  deleteAsset,
  createAsset,
  update3_0,
  fetchDeptInfoById,
  getDeptInfo,
  Contentful,
};
