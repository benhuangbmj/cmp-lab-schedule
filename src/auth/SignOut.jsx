import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateActive } from "/src/reducers/activeReducer";
import { apiBaseUrl } from "/src/utils";

import Button from "react-bootstrap/Button";

export default function SignOut() {
  const dispatch = useDispatch();
  const handleSignOut = () => {
    fetch(apiBaseUrl + "/logout", {
      method: "POST",
      credentials: "include",
    }).then(() => {
      dispatch(updateActive(null));
      const past = new Date(0);
      document.cookie = `activeUser=; expires=${past.toUTCString()}`;
      document.cookie = `activeStatus=; expires=${past.toUTCString()}`;
    });
  };
  return (
    <Button variant="outline-light" onClick={handleSignOut} size="sm">
      Sign out
    </Button>
  );
}
