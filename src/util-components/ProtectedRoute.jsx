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
  const [activeRole, setActiveRole] = useState(false);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    setActiveRole(userData?.[activeUser]?.roles?.[role]);
  }, [activeUser, role, userData]);

  console.log("active role", activeRole, false === undefined);

  if (!userData) {
    return <p>Loading user data... </p>;
  } else if (!loaded) {
    return <p>Unauthorised</p>;
  } else {
    if (!activeUser) {
      return <Navigate to="/" state={{ from: location }} replace />;
    } else if (role != undefined) {
      if (activeRole === false) {
        return <p>Loading</p>;
      } else if (!activeRole) {
        return <p>Unauthorised</p>;
      }
    }
    return children;
  }
}
