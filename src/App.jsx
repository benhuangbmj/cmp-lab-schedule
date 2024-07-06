import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import utils from "/src/utils";
import { capitalize } from "lodash";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useLayoutEffect,
  useMemo,
} from "react";
import { Route, Routes, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";

import { selectActive, updateActive } from "/src/reducers/activeReducer.js";
import { fetchUserData, selectUserData } from "/src/reducers/userDataReducer";

import { useLocation, Navigate } from "react-router-dom";

import {
  fetchInfo as preFetchInfo,
  fetchKey,
  update,
  update3_0,
} from "./api-operations.js";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faIdCard } from "@fortawesome/free-solid-svg-icons";

import Schedule from "./Schedule";
import Profile from "./profile/Profile";
import FrontendLab from "./FrontendLab";
import LogIn from "/src/auth/LogIn";
import ProtectedRoute from "/src/util-components/ProtectedRoute";
import SignOut from "/src/auth/SignOut";
import Admin from "/src/admin/Admin";
import Progress from "/src/progress/Progress";
import CheckInWithID from "/src/checkInWithID/CheckInWithID";

const routes = ["profile", "admin", "progress", "experimental"];

export default function App() {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [info, setInfo] = useState(null);
  const [courseTutor, setCourseTutor] = useState(null);
  const [shifts, setShifts] = useState(null);
  const [navbar, setNavbar] = useState(true);
  const [navHeight, setNavHeight] = useState();
  const [fetchLogin, setFetchLogin] = useState(false);
  const observer = useMemo(
    () =>
      new MutationObserver((rec) => {
        setNavHeight(refNav.current.offsetHeight);
      }),
    [],
  );
  const refNav = useRef();
  const refNavCollapse = useRef();
  const active = useSelector(selectActive);
  const userData = useSelector(selectUserData);
  const dispatch = useDispatch();
  const location = useLocation();
  const { showBoundary } = useErrorBoundary();
  const fetchInfo = useCallback(async (next) => {
    return preFetchInfo(setCourseTutor, setInfo, setShifts, next);
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
                  setFetchLogin(true);
                },
              });
            } else {
              setFetchLogin(true);
            }
            dispatch(updateActive(res.user));
          } else {
            setFetchLogin(true);
          }
        })
        .catch((err) => {
          showBoundary(err);
        });
    }
  }, [userData]);

  useLayoutEffect(() => {
    if (refNav.current) {
      observer.observe(refNav.current, {
        subtree: true,
        attributeFilter: ["class"],
      });
      setNavHeight(refNav.current.offsetHeight);
    }
    const navbarToggler = document.querySelector("button.navbar-toggler");
    if (refNavCollapse.current) {
      const children = Array.from(refNavCollapse.current.children);
      children.forEach((child) => {
        child.onclick = () => {
          navbarToggler.click();
        };
      });
    }
  }, [info, fetchLogin]);

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
        <Navbar
          ref={refNav}
          style={{ display: navbar ? "initial" : "none" }}
          data-bs-theme="dark"
          expand="md"
          sticky="top"
        >
          <div className="flexbox-row bk-institutional-navy">
            <div
              className="flexbox-row"
              style={{
                justifyContent: "flex-start",
                margin: 0,
              }}
            >
              <NavLink className="nav-link" to="/">
                <Navbar.Brand>
                  <span className="shrink-on-mobile">CMP-Lab@Messiah</span>
                </Navbar.Brand>
              </NavLink>
              <Navbar.Toggle
                aria-controls="basic-navbar-nav"
                style={!active.user ? { display: "none" } : {}}
              />
              <Navbar.Collapse>
                {active.user && (
                  <Nav ref={refNavCollapse}>
                    <NavLink className="nav-link" to="/">
                      Schedule
                    </NavLink>
                    {routes.map((route) => (
                      <NavLink
                        key={route}
                        className="nav-link"
                        to={`/${route}`}
                      >
                        {capitalize(route)}
                      </NavLink>
                    ))}
                  </Nav>
                )}
              </Navbar.Collapse>
            </div>
            <Nav className="flexbox-row" style={{ margin: "0" }}>
              {!active.user ? (
                <NavLink
                  className="nav-link"
                  to="/login"
                  style={{ padding: "0" }}
                >
                  <Button size="sm" style={{ float: "right" }}>
                    <span className="button-text">Log in</span>{" "}
                    <span>
                      <FontAwesomeIcon icon={faUser} />
                    </span>
                  </Button>
                </NavLink>
              ) : (
                <>
                  <div
                    className="nav-link"
                    style={{
                      padding: "0",
                      marginRight: ".25em",
                    }}
                  >
                    <span className="button-text">
                      Hello, {info[active.user].name}
                    </span>
                  </div>
                  <SignOut />
                </>
              )}
              <DropdownButton
                className="button-text"
                size="sm"
                title="Student check in"
                id="student-check-in"
              >
                <Dropdown.Item href="/checkinwithid">
                  with ID <FontAwesomeIcon icon={faIdCard} />
                </Dropdown.Item>
                <Dropdown.Item disabled>with form</Dropdown.Item>
              </DropdownButton>
              <NavLink
                className="nav-link"
                to="/checkinwithid"
                style={{ padding: "0" }}
              >
                <Button className="mobile-only" size="sm">
                  <FontAwesomeIcon icon={faIdCard} />
                </Button>
              </NavLink>
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
                <Profile
                  info={info}
                  fetchInfo={fetchInfo}
                  navHeight={navHeight}
                />
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
                <Admin
                  info={info}
                  fetchInfo={fetchInfo}
                  navHeight={navHeight}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/experimental"
            element={
              <ProtectedRoute role="developer">
                <FrontendLab
                  info={info}
                  fetchInfo={fetchInfo}
                  modelLoaded={modelLoaded}
                  setModelLoaded={setModelLoaded}
                />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LogIn />} />
          <Route path="/checkinwithid" element={<CheckInWithID />} />
        </Routes>
      </div>
    );
  }
}
