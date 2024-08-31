import { useState, useEffect, useRef, useContext } from "react";
import { useSelector } from "react-redux";

import { AppContext } from "/src/contexts/AppContext";

import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import ButtonGroup from "react-bootstrap/ButtonGroup";

import {
  faCamera,
  faEraser,
  faFileArrowUp,
  faRotateRight,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import contentfulApi from "/src/api-operations";

export default function ChangePic({ selected }) {
  const { updateWithoutFetch, fetchInfo } = useContext(AppContext);
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
    updateWithoutFetch("transform", [selected, "profilePic"], newRotate);
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
      contentfulApi.createAsset(newPic, selected).then((res) => {
        setUploadStatus(false);
        fetchInfo();
      });
    }
  }
  return (
    <div>
      <div
        style={{ margin: "auto", width: "fit-content", position: "relative" }}
      >
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
        <Button
          className="rounded-circle"
          type="button"
          onClick={() => {
            refInput.current.click();
          }}
          style={{ position: "absolute", top: "0px", right: "-20px" }}
        >
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
          <span className="button-text">
            {uploadStatus ? "Uploading..." : "Upload"} &nbsp;
          </span>{" "}
          {uploadStatus ? (
            <Spinner size="sm"></Spinner>
          ) : (
            <FontAwesomeIcon icon={faFileArrowUp} />
          )}
        </Button>
        <Button
          type="button"
          disabled={profile ? false : true}
          onClick={() => {
            alert("This feature is under construction.");
          }}
        >
          <span className="button-text">Remove &nbsp;</span>{" "}
          <FontAwesomeIcon icon={faEraser} />
        </Button>
        <Button
          type="button"
          disabled={profile ? false : true}
          onClick={() => {
            handleRotate(true);
          }}
        >
          <span className="button-text">Rotate &nbsp;</span>{" "}
          <FontAwesomeIcon icon={faRotateRight} />
        </Button>
        <Button
          type="button"
          disabled={profile ? false : true}
          onClick={() => {
            handleRotate(false);
          }}
        >
          <span className="button-text">Rotate &nbsp;</span>{" "}
          <FontAwesomeIcon icon={faRotateLeft} />
        </Button>
      </ButtonGroup>
    </div>
  );
}
