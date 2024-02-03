import { useDispatch } from "react-redux";
import { updateActive } from "/src/reducers/activeReducer";

import Button from "react-bootstrap/Button";

export default function SignOut() {
  const dispatch = useDispatch();
  const handleSignOut = () => {
    dispatch(updateActive(null));
    const past = new Date(0);
    document.cookie = `activeUser=; expires=${past.toUTCString()}`;
    document.cookie = `activeStatus=; expires=${past.toUTCString()}`;
  };
  return (
    <Button variant="outline-light" onClick={handleSignOut} size="sm">
      Sign out
    </Button>
  );
}
