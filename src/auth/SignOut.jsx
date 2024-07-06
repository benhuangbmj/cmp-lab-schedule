import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateActive } from "/src/reducers/activeReducer";
import { apiBaseUrl } from "/src/utils";

import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";

export function handleSignOut(dispatch) {
  fetch(apiBaseUrl + "/logout", {
    method: "POST",
    credentials: "include",
  }).then(() => {
    dispatch(updateActive(null));
    const past = new Date(0);
    document.cookie = `activeUser=; expires=${past.toUTCString()}`;
    document.cookie = `activeStatus=; expires=${past.toUTCString()}`;
  });
}
export default function SignOut() {
  const dispatch = useDispatch();
  return (
    <Button
      onClick={() => {
        handleSignOut(dispatch);
      }}
      size="sm"
    >
      <span className="button-text">Sign out</span>{" "}
      <FontAwesomeIcon icon={faArrowRightFromBracket} />
    </Button>
  );
}
