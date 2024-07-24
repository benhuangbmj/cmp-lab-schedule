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
import { useErrorBoundary } from "react-error-boundary";

import { selectActive, updateActive } from "/src/reducers/activeReducer.js";
import { fetchUserData, selectUserData } from "/src/reducers/userDataReducer";

import { useLocation, Navigate } from "react-router-dom";

import {
  fetchInfo as preFetchInfo,
  fetchKey,
  update3_0,
} from "./api-operations.js";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faIdCard,
  faCameraRetro,
} from "@fortawesome/free-solid-svg-icons";

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
import UserPanel from "/src/userPanel/UserPanel";
import NavDropdown from "react-bootstrap/NavDropdown";

const routes = ["profile", "admin", "progress", "experimental"];

export default function App() {
  const [info, setInfo] = useState(null);
  const [courseTutor, setCourseTutor] = useState(null);
  const [shifts, setShifts] = useState(null);
  const [navbar, setNavbar] = useState(true);
  const [navHeight, setNavHeight] = useState();
  const [fetchLogin, setFetchLogin] = useState(false);
  const observer = useMemo(
    () =>
      new MutationObserver(() => {
        setNavHeight(refNav.current.offsetHeight);
      }),
    [],
  );
  const refNav = useRef();
  const refNavCollapse = useRef();
  const refBrand = useRef();
  const active = useSelector(selectActive);
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
  useEffect(() => {
    console.log("App.jsx", location);
  });

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
          style={{
            display: navbar ? "initial" : "none",
            zIndex: 1,
          }}
          data-bs-theme="dark"
          expand="xl"
          sticky="top"
        >
          <div
            className="flexbox-row bk-institutional-navy"
            style={{ alignItems: "start" }}
          >
            <Nav
              className="flexbox-row"
              style={{
                justifyContent: "flex-start",
                margin: 0,
              }}
            >
              <Nav.Item ref={refBrand}>
                <NavLink className="nav-link" to="/">
                  <Navbar.Brand>
                    <span className="shrink-on-mobile">CMP-Lab@Messiah</span>
                  </Navbar.Brand>
                </NavLink>
              </Nav.Item>
              <NavLink className="nav-link" to="/">
                Schedule
              </NavLink>
              <NavLink to="/dashboard" className="nav-link">
                Dashboard
              </NavLink>
              <Navbar.Toggle
                aria-controls="basic-navbar-nav"
                style={!active.user ? { display: "none" } : {}}
              />
              <Navbar.Collapse style={{ width: "0px" }}>
                {active.user && (
                  <Nav ref={refNavCollapse}>
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
            </Nav>
          </div>
        </Navbar>
        <Navbar data-bs-theme="dark">
          <Nav
            className="flexbox-row"
            style={{
              position: "fixed",
              top: "0",
              right: "0",
              zIndex: 1,
            }}
          >
            <NavDropdown
              className="button-text"
              title="Student check in"
              id="student-check-in"
            >
              <NavDropdown.Item>
                <NavLink
                  className="nav-link"
                  style={{ paddingLeft: 0 }}
                  to="/checkinwithid"
                >
                  with ID (Demo) &nbsp;
                  <FontAwesomeIcon icon={faIdCard} />
                </NavLink>
              </NavDropdown.Item>
              <NavDropdown.Item>
                <NavLink
                  className="nav-link"
                  style={{ paddingLeft: 0 }}
                  to="/checkinwithface"
                >
                  with face (Demo) &nbsp;
                  <FontAwesomeIcon icon={faCameraRetro} />
                </NavLink>
              </NavDropdown.Item>
              <NavDropdown.Item disabled>with form</NavDropdown.Item>
            </NavDropdown>
            <Nav.Item className="mobile-only" style={{ padding: "0 .25em" }}>
              <NavLink className="nav-link" to="/checkinwithid">
                <FontAwesomeIcon icon={faIdCard} />
              </NavLink>
            </Nav.Item>
            <Nav.Item className="mobile-only" style={{ padding: "0 .25em" }}>
              <NavLink className="nav-link" to="/checkinwithface">
                <FontAwesomeIcon icon={faCameraRetro} />
              </NavLink>
            </Nav.Item>
            {!active.user ? (
              <NavLink className="nav-link" to="/login">
                <Nav.Item style={{ float: "right", padding: ".25em" }}>
                  <span className="button-text">Log in</span>{" "}
                  <span>
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                </Nav.Item>
              </NavLink>
            ) : (
              <UserPanel height={refBrand.current?.clientHeight} />
            )}
          </Nav>
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
