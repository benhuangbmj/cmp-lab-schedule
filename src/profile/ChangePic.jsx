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
    setUploadStatus("Uploading ...");
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
    <div>
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
