//Note: Currently Login is removed from the app altogether.
import "/src/App.css";

import bcrypt from "bcryptjs";

import { generateVerificationCode, apiBaseUrl } from "/src/utils.js";
import { update2_0 } from "/src/api-operations.js";
import { fetchKey } from "/src/api-operations.js";

import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { selectUserData } from "/src/reducers/userDataReducer.js";
import { selectActive, updateActive } from "/src/reducers/activeReducer.js";
import { useLocation, Navigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import ResetPassword from "./ResetPassword";
import { AppContext } from "/src/contexts/AppContext";

export default function LogIn() {
  const { basePath } = useContext(AppContext);
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    reset: resetLogin,
    formState: { errors: errorsLogin },
  } = useForm();
  const dispatch = useDispatch();
  const [redirect, setRedirect] = useState(false);
  const userData = useSelector(selectUserData).items;
  const active = useSelector(selectActive);
  const location = useLocation();

  const getExpires = () => {
    const now = Date.now();
    const exp = new Date(now + 5 * 24 * 3600 * 1000);
    return exp.toUTCString();
  };

  const handleVerify = (username, verified) => {
    if (verified) {
      alert(`Log in successfully, ${userData[username].name}!`);
      dispatch(updateActive(username));
      const status = generateVerificationCode(33);
      update2_0("status", [username], status)
        .then(() => {
          const result = status.code;
          document.cookie = `activeUser=${username}; expires=${getExpires()}`;
          document.cookie = `activeStatus=${result}; expires=${getExpires()}`;
        })
        .catch((err) => console.log("Log in error: ", err));
    } else {
      alert("Invalid credential!");
    }
  };

  const handleLogin = async (data) => {
    if (userData.hasOwnProperty(data.username)) {
      const currPassword = await fetchKey(data.username, "password");
      if (currPassword != null) {
        const verified = bcrypt.compareSync(data.password, currPassword);
        handleVerify(data.username, verified);
      } else {
        handleVerify(data.username, data.password === data.username);
      }
    } else {
      alert("The username doesn't exist");
    }
  };
  const handleMicrosoftLogin = function () {
    if (location.state?.to) {
      fetch(apiBaseUrl + "/auth/microsoft", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        credentials: "include",
        body: location.state.to,
      }).then(() => (window.location.href = apiBaseUrl + "/auth/microsoft"));
    } else if (basePath != "/") {
      fetch(apiBaseUrl + "/auth/microsoft", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        credentials: "include",
        body: basePath,
      }).then(() => (window.location.href = apiBaseUrl + "/auth/microsoft"));
    } else {
      window.location.href = apiBaseUrl + "/auth/microsoft";
    }
  };
  const handleRedirect = () => {
    setRedirect(true);
  };
  return (
    <main className="center-fit">
      {/*!active.user ? (
        <>
          <form onSubmit={handleSubmitLogin(handleLogin)}>
            <div>
              <div className="flexbox-row">
                <label>Username: </label>
                <input
                  type="text"
                  name="username"
                  {...registerLogin("username", {
                    required: "Please enter your username.",
                  })}
                />
              </div>
              <div className="flexbox-row">
                <label>Password: </label>
                <input
                  type="password"
                  name="password"
                  {...registerLogin("password", {
                    required: "Please enter your password.",
                  })}
                />
              </div>
              <div className="flexbox-row">
                <Button type="submit">Submit</Button>
                <ResetPassword />
              </div>
              {Object.keys(errorsLogin).map((key) => (
                <p key={key} className="errorMessage">
                  {errorsLogin[key].message}
                </p>
              ))}
            </div>
          </form>
        </>
      ) : (
        <div className="center-fit">
          Log in successfully, {userData[active.user].name}!
        </div>
      )}
      {location.state && active.user && (
        <Button type="button" onClick={handleRedirect}>
          Go back to the previous page
        </Button>
      )*/}
      <Button type="button" onClick={handleMicrosoftLogin}>
        Log in with a Microsoft account
      </Button>
      {redirect && <Navigate to={location.state.from.pathname} />}
    </main>
  );
}

/*
1. Show the last log in time
*/
