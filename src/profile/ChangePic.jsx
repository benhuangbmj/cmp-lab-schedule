import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getSingleAsset, update, fetchKey } from "/src/api-operations";
import contentfulApi from "/src/api-operations";

export default function ChangePic({ selected, setRenew }) {
  const [newPic, setNewPic] = useState();
  const [uploadStatus, setUploadStatus] = useState("Upload");
  const [profile, setProfile] = useState();
  const userData = useSelector((state) => state.userData.items);

  useEffect(() => {
    if (selected && userData[selected].profilePic)
      setProfile(userData[selected].profilePic.url);
    else setProfile();
  }, [selected]);

  useEffect(() => {
    if (newPic) {
      const newPicURL = URL.createObjectURL(newPic);
      setProfile(newPicURL);
    }
  }, [newPic]);

  function handleChangeProfile(e) {
    setNewPic(e.target.files[0]);
  }

  function handleRotate(clockwise) {
    const newDeg = clockwise ? 90 : -90;
    const currInfo = userData[selected];
    let newRotate;
    if (!currInfo.profilePic.transform) {
      newRotate = `rotate(${newDeg}deg)`;
    } else {
      const currRotation = currInfo.profilePic.transform;
      const regex = /-*\d+/g;
      const currDeg = currRotation.match(regex)[0];
      newRotate = currRotation.replace(
        regex,
        `${(Number(currDeg) + newDeg) % 360}`,
      );
    }
    contentfulApi
      .update2_0("transform", [selected, "profilePic"], newRotate)
      .then(() => {
        setRenew((state) => state + 1);
      });
  }

  async function uploadPic() {
    setUploadStatus("Uploading ..."); /*
    const deleteAsset = async function (assetId) {
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
    };*/ /*
    const createAsset = async function (file, title) {
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
          setUploadStatus("Upload");
          const currAsset = await getSingleAsset(createdId);
          const currUrl = currAsset.fields.file["en-US"].url;
          const newProfile = {
            url: currUrl,
            id: createdId,
          };
          update("profilePic", [selected], newProfile, fetchInfo);
        }, 1000);
      }
    };*/
    const tutor = userData[selected];
    if (tutor.profilePic && tutor.profilePic.id) {
      var deleted = await contentfulApi.deleteAsset(tutor.profilePic.id);
    } else {
      var deleted = true;
    }
    if (deleted) {
      contentfulApi.createAsset(newPic, selected).then(() => {
        setUploadStatus("Upload");
        setRenew((state) => state + 1);
      });
    }
  }
  return (
    <div className="designing">
      {selected ? (
        <img
          className="profile-container"
          src={
            profile
              ? profile
              : "https://www.messiah.edu/images/stained_glass_circle1_multicolor.jpg"
          }
        />
      ) : (
        <div className="profile-container">
          <span style={{ position: "absolute" }}>profile</span>
          <span style={{ position: "relative", top: "20px" }}>picture</span>
        </div>
      )}
      <input
        style={{ width: "102px", display: "block", margin: "auto" }}
        className="designing"
        type="file"
        accept="image/*"
        onChange={handleChangeProfile}
      />
      <div className="flexbox-row" style={{ width: "fit-content" }}>
        <button
          type="button"
          disabled={newPic ? false : true}
          onClick={uploadPic}
        >
          {uploadStatus}
        </button>
        <button
          type="button"
          disabled={profile ? false : true}
          onClick={() => {
            alert("This feature is under construction.");
          }}
        >
          Remove
        </button>
      </div>
      <div className="flexbox-row" style={{ width: "fit-content" }}>
        <button
          type="button"
          disabled={profile ? false : true}
          onClick={() => {
            handleRotate(true);
          }}
        >
          Rotate Clockwise
        </button>
        <button
          type="button"
          disabled={profile ? false : true}
          onClick={() => {
            handleRotate(false);
          }}
        >
          Rotate Counterclockwise
        </button>
      </div>
    </div>
  );
}
