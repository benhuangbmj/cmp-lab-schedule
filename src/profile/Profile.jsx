import bcrypt from "bcryptjs";

import { useState, useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useSelector } from "react-redux";

import { getSingleAsset, update, fetchKey } from "/src/api-operations";
import { schema as dataSchema, courseOptions, blankForm } from "/src/utils";

import SelectUser from "/src/util-components/SelectUser";

import CardDisplay from "/src/IDcard/CardDisplay";
import Scheduling from "/src/scheduling/Scheduling";
import ChangePic from "./ChangePic";

import sendEmail from "/src/utils/sendEmail";

const spaceId = import.meta.env.VITE_SPACE_ID;
const accessToken = import.meta.env.VITE_ACCESS_TOKEN;
const cmaToken = import.meta.env.VITE_CMA_TOKEN;
const privilege = import.meta.env.VITE_PRIVILEGE;

const display = ["username", "name", "subject", "links", "password"];

export default function Profile({ info, fetchInfo }) {
  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    getValues,
  } = useForm({
    reValidateMode: "onSubmit",
  });
  const activeUser = useSelector((state) => state.active.user);
  const userData = useSelector((state) => state.userData.items);
  const [renew, setRenew] = useState(0);
  const [newPic, setNewPic] = useState();
  const [uploadStatus, setUploadStatus] = useState("Upload");
  const [profile, setProfile] = useState();
  const [selected, setSelected] = useState(activeUser);
  const [loggedIn, setLoggedIn] = useState(true);
  const currUser = useRef();
  const newUsername = watch("username");

  function generateUsernameError() {
    setError("username", {
      type: "conflict",
      message: "The username already exists.",
    });
  }

  const resetAll = () => {
    reset(blankForm);
    setNewPic();
    setProfile();
  };

  const handleUpdate = async (data) => {
    const username = data.username;
    delete data.username;
    const links = {};
    Object.keys(dataSchema.links).forEach((key) => {
      links[key] = data[key];
      delete data[key];
    });
    data.links = links;
    if (typeof data.password == "string") {
      data.password = data.password.trim();
    }
    if (data.password && data.password != "") {
      data.password = bcrypt.hashSync(data.password, 10);
      setLoggedIn(false);
    } else if (selected) {
      data.password = await fetchKey(selected, "password");
    }
    data.lastUpdate = new Date().toString();
    data = Object.assign(dataSchema, data);
    update(username, [], data, fetchInfo).then(() => {
      if (!selected) {
        resetAll();
      }
    });
  };
  const handleSelect = (currSelected) => {
    if (currSelected) {
      const user = currSelected.value;
      resetAll();
      setSelected(user);
      displayInfo(user);
    } else {
      setSelected();
      setProfile();
      resetAll();
    }
  };

  const handleBackup = () => {
    const passcode = prompt("Please enter the passocde.");
    if (passcode === privilege) {
      update(null, [], info, fetchInfo, true).then(() => {
        alert("Backup Successful!");
      });
    } else {
      alert("No privilege to back up.");
    }
  };

  const displayInfo = (user) => {
    setProfile();
    if (info[user] && info[user].profilePic) {
      setProfile(info[user].profilePic.url);
    }
    const initialVal = info[user]
      ? Object.assign({}, { username: user }, info[user], info[user].links)
      : Object.assign(Object.create(dataSchema), dataSchema.links);
    delete initialVal.links;
    delete initialVal.password;
    reset(initialVal);
  };

  const handleLogin = (data) => {
    if (info[selected].password) {
      const verified = bcrypt.compareSync(data.pw, info[selected].password);
      if (!verified) {
        alert("Invalid password.");
        return;
      } else {
        alert("Log in successfully!");
        setLoggedIn(true);
        const now = new Date();
        sendEmail(
          "bhuang",
          `User ${selected} logged in at ${now.toLocaleString("en-US", { timeZone: "America/New_York" })}.`,
        );
      }
    }
    displayInfo(selected);
  };

  const handleDelete = function () {
    const confirm = prompt('Type "Confirm" to proceed to delete the user');
    if (confirm === "Confirm") {
      delete info[selected];
      update(null, [], info, fetchInfo);
      setSelected();
    } else {
      alert("Action terminated.");
    }
  };

  useEffect(() => {
    if (!selected) {
      clearErrors();
      if (Object.hasOwn(userData, newUsername)) {
        generateUsernameError();
      }
    }
  }, [newUsername]);

  useEffect(() => {
    displayInfo(selected);
  }, []);

  useEffect(() => {
    if (renew) {
      fetchInfo();
    }
  }, [renew]);

  return (
    <main>
      <div
        className="flexbox-column padding-1rem designing"
        style={{ width: "45rem" }}
      >
        <form onSubmit={handleSubmit(handleUpdate)} style={{ width: "100%" }}>
          <div
            className="sticky-top flexbox-column designing"
            style={{ margin: "0", float: "left", top: "50px" }}
          >
            <button
              type="submit"
              disabled={!selected ? false : loggedIn ? false : true}
            >
              {selected ? "Update" : "Create"}
            </button>
            <button type="reset">Reset</button>
            <button
              type="button"
              disabled={loggedIn ? false : true}
              onClick={handleDelete}
            >
              Delete
            </button>
            <button type="button" onClick={handleBackup}>
              Backup
            </button>
          </div>
          <div
            className="designing"
            style={{ position: "relative", top: "0", borderColor: "blue" }}
          >
            {userData[activeUser].roles.admin && (
              <div className="designing" style={{ borderColor: "green" }}>
                <SelectUser info={info} handleSelect={handleSelect} />
                <span> or </span>
                <button type="button" onClick={() => handleSelect(null)}>
                  Create a New User
                </button>
              </div>
            )}
            {selected && (
              <p
                className="designing"
                style={{
                  width: "fit-content",
                  textAlign: "left",
                  margin: "auto",
                }}
              >
                Last Update: {info[selected].lastUpdate}
              </p>
            )}
            <div className="flexbox-column card-profile-frame designing">
              <ChangePic selected={selected} setRenew={setRenew} />
              {selected && loggedIn ? (
                <div className="card-holder">
                  <CardDisplay
                    pageSize={[220, 290]}
                    pageOrientation="landscape"
                    info={{ user: info[selected] }}
                  />
                </div>
              ) : (
                <div className="card-holder">ID card</div>
              )}
            </div>
            <div className="flexbox-column designing">
              <div className="input-holder designing">
                {["username"].concat(Object.keys(dataSchema)).map((e) => {
                  if (display.includes(e)) {
                    return e != "links" ? (
                      <div key={e}>
                        <label>
                          {e == "password" ? "new passowrd" : e}
                          {e == "username" && (
                            <sup style={{ color: "red" }}>*</sup>
                          )}
                          :{" "}
                        </label>
                        {e == "username" && selected ? (
                          <input
                            readOnly
                            type="text"
                            className="read-only"
                            {...register(e)}
                          />
                        ) : e == "username" ? (
                          <>
                            <input
                              type="text"
                              {...register(e, {
                                required: "Username is required.",
                                pattern: {
                                  value: /^\D/,
                                  message:
                                    "Username cannot start with numbers.",
                                },
                                validate: (value) =>
                                  !Object.hasOwn(userData, value),
                              })}
                            />
                            {errors.username ? (
                              <p className="errorMessage">
                                {errors.username.message}
                              </p>
                            ) : null}
                          </>
                        ) : (
                          <input
                            type={e == "password" ? "password" : "text"}
                            {...register(e)}
                          />
                        )}
                      </div>
                    ) : (
                      Object.keys(dataSchema[e]).map((link) => {
                        return (
                          <div key={link}>
                            <label
                              htmlFor={link}
                              style={{ textTransform: "capitalize" }}
                            >
                              {link}:
                            </label>
                            <input id={link} type="url" {...register(link)} />
                          </div>
                        );
                      })
                    );
                  }
                })}
              </div>
            </div>
            <div className="designing" style={{ margin: "auto" }}>
              <Scheduling
                info={info}
                fetchInfo={fetchInfo}
                selected={loggedIn ? selected : null}
              />
            </div>
            <div className="designing">
              <h4>courses: </h4>
              <div className="flexbox-row course-container padding-1rem">
                {courseOptions.map((e) => (
                  <div key={e}>
                    <input
                      type="checkbox"
                      id={e}
                      value={e}
                      {...register("courses")}
                    />
                    <label htmlFor={e} className="small-label">
                      {e}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
