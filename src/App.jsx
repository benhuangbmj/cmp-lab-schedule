import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import utils from "/src/utils";

import { useState, useEffect, useCallback } from "react";
import { Route, Routes } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useErrorBoundary } from "react-error-boundary";

import { updateActive } from "/src/reducers/activeReducer.js";
import { fetchUserData, selectUserData } from "/src/reducers/userDataReducer";

import { useLocation, Navigate } from "react-router-dom";

import {
  fetchInfo as preFetchInfo,
  fetchKey,
  update3_0,
} from "./api-operations.js";

import Navbar from "/src/navbar/Navbar";

import Schedule from "./Schedule";
import Profile from "./profile/Profile";
import FrontendLab from "./FrontendLab";
import LogIn from "/src/auth/LogIn";
import ProtectedRoute from "/src/util-components/ProtectedRoute";
import Admin from "/src/admin/Admin";
import Progress from "/src/progress/Progress";
import Charts from "/src/dashboard/Charts";
import CheckInWithID from "/src/checkInWithID/CheckInWithID";
import CheckInWithFace from "/src/checkInWithFace/CheckInWithFace";

export default function App() {
  const [info, setInfo] = useState(null);
  const [courseTutor, setCourseTutor] = useState(null);
  const [shifts, setShifts] = useState(null);
  const [fetchLogin, setFetchLogin] = useState(false);
  const userData = useSelector(selectUserData);
  const dispatch = useDispatch();
  const location = useLocation();
  const { showBoundary } = useErrorBoundary();
  const fetchInfo = useCallback(async (next) => {
    return preFetchInfo(setCourseTutor, setInfo, setShifts, next, showBoundary);
  }, []);

  const checkActive = async () => {
    const cookieStr = document.cookie.split(";");
    const cookie = {};
    cookieStr.forEach((str) => {
      const [key, value] = str.split("=");
      cookie[key.trim()] = value;
    });
    if (cookie.activeUser != null) {
      const userStatus = await fetchKey(cookie.activeUser, "status");
      if (userStatus.code == cookie.activeStatus) {
        dispatch(updateActive(cookie.activeUser));
        return;
      }
    }
    dispatch(updateActive(null));
  };

  useEffect(() => {
    if (!info) {
      fetchInfo();
      dispatch(fetchUserData());
    }
    checkActive();
  }, []);

  useEffect(() => {
    if (userData.status == "succeeded") {
      const users = Object.keys(userData.items);
      fetch(utils.apiBaseUrl + "/login", { credentials: "include" })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          if (res) {
            if (!users.includes(res.user)) {
              const newUser = { ...utils.schema };
              Object.assign(newUser, res.profile);
              update3_0({
                targetKey: res.user,
                keys: [],
                value: newUser,
                fetchInfo: fetchInfo,
                next: () => {
                  dispatch(fetchUserData());
                },
              });
            }
            dispatch(updateActive(res.user));
          }
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setFetchLogin(true);
        });
    }
  }, [userData]);

  if (!info || !fetchLogin) {
    return (
      <main>
        <h1>Loading ...</h1>
      </main>
    );
  } else {
    if (location.state?.from) {
      return (
        <Navigate to="/login" state={{ to: location.state.from.pathname }} />
      );
    }
    return (
      <div>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={<Schedule shift={shifts} courses={courseTutor} />}
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile info={info} fetchInfo={fetchInfo} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <Progress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <Admin info={info} fetchInfo={fetchInfo} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/experimental"
            element={
              <ProtectedRoute role="developer">
                <FrontendLab info={info} fetchInfo={fetchInfo} />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LogIn />} />
          <Route path="/checkinwithid" element={<CheckInWithID />} />
          <Route path="/checkinwithface" element={<CheckInWithFace />} />
          <Route path="/dashboard" element={<Charts />} />
        </Routes>
      </div>
    );
  }
}
