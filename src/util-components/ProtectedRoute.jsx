import { useSelector, useDispatch } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { useState, useLayoutEffect, useEffect } from "react";
import { updateActive } from "/src/reducers/activeReducer";
import utils from "/src/utils";

export default function ProtectedRoute({ children, role }) {
  const location = useLocation();
  const activeUser = useSelector((state) => state.active.user);
  const loaded = useSelector((state) => state.active.loaded);
  const userData = useSelector((state) => state.userData.items);
  const [activeRole, setActiveRole] = useState();
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    if (activeUser && role && userData)
      setActiveRole(userData[activeUser].roles[role]);
  }, [activeUser, role, userData]);

  if (!(loaded && userData)) {
    return <p>Loading</p>;
  } else {
    if (!activeUser) {
      return <Navigate to="/" state={{ from: location }} replace />;
    } else if (role != undefined) {
      if (activeRole === undefined) {
        return <p>Loading</p>;
      } else if (!activeRole) {
        return <p>Unauthorised</p>;
      }
    }
    return children;
  }
}
