import bcrypt from "bcryptjs";

import { useState, useEffect, useCallback, useRef, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useSelector } from "react-redux";

import { getSingleAsset, update, fetchKey } from "/src/api-operations";
import { schema as dataSchema, courseOptions, blankForm } from "/src/utils";

import SelectUser from "/src/util-components/SelectUser";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";

import CardDisplay from "/src/IDcard/CardDisplay";
import Scheduling from "/src/scheduling/Scheduling";
import ChangePic from "./ChangePic";

import sendEmail from "/src/utils/sendEmail";

const spaceId = import.meta.env.VITE_SPACE_ID;
const accessToken = import.meta.env.VITE_ACCESS_TOKEN;
const cmaToken = import.meta.env.VITE_CMA_TOKEN;
const privilege = import.meta.env.VITE_PRIVILEGE;

const display = ["username", "name", "subject", "links", "password"];

const Profile = forwardRef(function Profile(
  {
    info,
    fetchInfo,
    user = null,
    setLoaded,
    navHeight
  },
  ref,
) {
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
  const [selected, setSelected] = useState(user ? user : activeUser);
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

  const handleDelete = function() {
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
    setLoaded(true);
    return () => setLoaded(false);
  }, []);

  useEffect(() => {
    if (renew) {
      fetchInfo();
    }
  }, [renew]);

  return (
    <main>
      <div ref={ref} className="flexbox-column profile-page" style={{padding: "0px 0px 1em 2em"}}>
        <form onSubmit={handleSubmit(handleUpdate)} style={{ width: "100%" }}>
          <div
            className="sticky-top flexbox-column "
            style={{ margin: "0", float: "right", top: navHeight + 20 + "px" }}
          >
            <ButtonGroup vertical>
              <Button
                type="submit"
                disabled={!selected ? false : loggedIn ? false : true}
              >
                {selected ? (
                  <span>
                    <span className="button-text">Update&nbsp;</span>{" "}
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </span>
                ) : (
                  <span>
                    <span className="button-text">Create&nbsp;</span>{" "}
                    <FontAwesomeIcon icon={faUserPlus} />
                  </span>
                )}
              </Button>
              <Button type="reset">
                <span className="button-text">Reset&nbsp;&nbsp;</span>{" "}
                <FontAwesomeIcon icon={faRotateLeft} />
              </Button>
              <Button
                type="Button"
                disabled={loggedIn ? false : true}
                onClick={handleDelete}
              >
                <span className="button-text">Delete&nbsp;</span>{" "}
                <FontAwesomeIcon icon={faTrashCan} />
              </Button>
              <Button type="Button" onClick={handleBackup}>
                <span className="button-text">Backup&nbsp;</span>{" "}
                <FontAwesomeIcon icon={faDatabase} />
              </Button>
            </ButtonGroup>
          </div>
          <div className="" style={{ borderColor: "blue", width: "87%" }}>
            {!user && userData[activeUser].roles.admin && (
              <div className=" center-fit">
                <SelectUser info={info} handleSelect={handleSelect} />
                <p> or </p>
                <Button type="Button" onClick={() => handleSelect(null)}>
                  Create a New User
                </Button>
              </div>
            )}
            {selected && (
              <div className=" center-fit">
                <strong>Last Update</strong>:
                <br />
                <span className="shrink-on-mobile">
                  {info[selected].lastUpdate}
                </span>
              </div>
            )}
            <div className="flexbox-column card-profile-frame ">
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
            <div className="center-fit ">
              {["username"].concat(Object.keys(dataSchema)).map((e) => {
                if (display.includes(e)) {
                  return e != "links" ? (
                    <div className="flexbox-row" key={e}>
                      <label style={{ marginRight: "1em" }}>
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
                                message: "Username cannot start with numbers.",
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
                        <div className="flexbox-row" key={link}>
                          <label
                            htmlFor={link}
                            style={{
                              textTransform: "capitalize",
                              marginRight: "1em",
                            }}
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
            <div className="" style={{ margin: "auto" }}>
              <Scheduling
                info={info}
                fetchInfo={fetchInfo}
                selected={loggedIn ? selected : null}
              />
            </div>
            <div className="">
              <h5>
                {userData[selected] ? userData[selected].name + "'s" : ""}{" "}
                Courses:{" "}
              </h5>
              <div className=" flexbox-row course-container padding-1rem">
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
});

export default Profile;
