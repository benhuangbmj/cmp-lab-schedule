import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import utils from "/src/utils";

import { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";

import { updateActive } from "/src/reducers/activeReducer.js";
import { fetchUserData, selectUserData } from "/src/reducers/userDataReducer";

import { useLocation, Navigate } from "react-router-dom";

import { fetchKey, update3_0 } from "./api-operations.js";

import Navbar from "/src/navbar/Navbar";
import Routes from "/src/routes/Routes";

import { AppContext } from "/src/contexts/AppContext";
export default function App() {
  const { info, fetchInfo } = useContext(AppContext);
  const [fetchLogin, setFetchLogin] = useState(false);
  const userData = useSelector(selectUserData);
  const dispatch = useDispatch();
  const location = useLocation();
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
        <Routes />
      </div>
    );
  }
}
