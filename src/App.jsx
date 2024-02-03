import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import utils from "/src/utils";

import { useState, useEffect, useCallback } from "react";
import { Route, Routes, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { selectActive, updateActive } from "/src/reducers/activeReducer.js";
import { fetchUserData } from "/src/reducers/userDataReducer";

import { fetchInfo as preFetchInfo, fetchKey } from "./api-operations.js";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import NavDropdown from "react-bootstrap/NavDropdown";

import Schedule from "./Schedule";
import Profile from "./profile/Profile";
import FrontendLab from "./FrontendLab";
import LogIn from "/src/auth/LogIn";
import ProtectedRoute from "/src/utils/ProtectedRoute";
import SignOut from "/src/auth/SignOut";
import Admin from "/src/admin/Admin";

export default function App() {
  const [info, setInfo] = useState(null);
  const [courseTutor, setCourseTutor] = useState(null);
  const [shifts, setShifts] = useState(null);
  const [navbar, setNavbar] = useState(true);

  const active = useSelector(selectActive);

  const dispatch = useDispatch();

  const fetchInfo = useCallback(async () => {
    return preFetchInfo(setCourseTutor, setInfo, setShifts);
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

  if (!info) {
    return (
      <main>
        <h1>Loading ...</h1>
      </main>
    );
  } else {
    return (
      <div>
        <Navbar
          style={{ display: navbar ? "initial" : "none" }}
          data-bs-theme="dark"
          expand="md"
          sticky="top"
        >
          <div className="flexbox-row bk-institutional-navy">
            <div
              className="flexbox-row"
              style={{ justifyContent: "flex-start", margin: 0 }}
            >
              <NavLink className="nav-link" to="/">
                <Navbar.Brand>CMP-Lab@Messiah</Navbar.Brand>
              </NavLink>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse>
                {active.user && (
                  <Nav>
                    <NavLink className="nav-link" to="/">
                      Schedule
                    </NavLink>
                    <NavLink className="nav-link" to="/profile">
                      Profile
                    </NavLink>
                    <NavLink className="nav-link" to="/admin">
                      Administration
                    </NavLink>
                    <NavLink className="nav-link" to="/experimental">
                      Experimental
                    </NavLink>
                  </Nav>
                )}
              </Navbar.Collapse>
            </div>
            <Nav>
              {!active.user ? (
                <NavLink className="nav-link" to="/login">
                  <button type="button"> Log in </button>
                </NavLink>
              ) : (
                <SignOut />
              )}
            </Nav>
          </div>
        </Navbar>
        <Routes>
          <Route
            path="/"
            element={
              <Schedule
                shift={shifts}
                courses={courseTutor}
                setNavbar={setNavbar}
              />
            }
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
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <Admin />
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
        </Routes>
      </div>
    );
  }
}
