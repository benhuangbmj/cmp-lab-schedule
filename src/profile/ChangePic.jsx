import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import Button from "react-bootstrap/Button";
import Spinner from 'react-bootstrap/Spinner';
import ButtonGroup from "react-bootstrap/ButtonGroup";

import {faCamera, faEraser, faFileArrowUp, faRotateRight, faRotateLeft} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import contentfulApi from "/src/api-operations";

export default function ChangePic({ selected, setRenew }) {
  const [newPic, setNewPic] = useState();
  const [uploadStatus, setUploadStatus] = useState(false);
  const [profile, setProfile] = useState();
  const userData = useSelector((state) => state.userData.items);
  const refInput = useRef();

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
    setUploadStatus(true);
    const tutor = userData[selected];
    if (tutor.profilePic && tutor.profilePic.id) {
      var deleted = await contentfulApi.deleteAsset(tutor.profilePic.id);
    } else {
      var deleted = true;
    }
    if (deleted) {
      contentfulApi.createAsset(newPic, selected).then(() => {
        setUploadStatus(false);
        setRenew((state) => state + 1);
      });
    }
  }
  return (
    <div>
      <div style={{position: 'relative'}} >
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
        <Button className='rounded-circle' type='button' onClick={() => { refInput.current.click() }} style={{ position: 'absolute', top: "145px", right: "99px" }}>
          <FontAwesomeIcon icon={faCamera} />
        </Button>
      </div>
      <input
        ref={refInput}
        style={{ display: "none" }}
        type="file"
        accept="image/*"
        onChange={handleChangeProfile}
      />
      <ButtonGroup>
        <Button
          type="button"
          disabled={newPic ? false : true}
          onClick={uploadPic}
        >
          <span className="button-text">{uploadStatus? "Uploading..." : "Upload"} &nbsp;</span>{" "} 
          {uploadStatus? <Spinner size='sm'></Spinner> : <FontAwesomeIcon icon={faFileArrowUp} />}
        </Button>
        <Button
          type="button"
          disabled={profile ? false : true}
          onClick={() => {
            alert("This feature is under construction.");
          }}
        >
          <span className="button-text">Remove &nbsp;</span>{" "}
          <FontAwesomeIcon icon={faEraser}/>
        </Button>
        <Button
          type="button"
          disabled={profile ? false : true}
          onClick={() => {
            handleRotate(true);
          }}
        >
          <span className="button-text">Rotate &nbsp;</span>{" "} <FontAwesomeIcon icon={faRotateRight} />
        </Button>
        <Button
          type="button"
          disabled={profile ? false : true}
          onClick={() => {
            handleRotate(false);
          }}
        >
          <span className="button-text">Rotate &nbsp;</span>{" "} <FontAwesomeIcon icon={faRotateLeft} />
        </Button>
      </ButtonGroup>
    </div>
  );
}
