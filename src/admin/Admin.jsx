import devTools from "/src/devTools"; //remove

import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useEffect, useState, useMemo, useRef } from "react";

import utils, { fieldOptions } from "/src/utils";
import contentful from "/src//api-operations";

import Popup from "reactjs-popup";
import Button from "react-bootstrap/Button";
import CloseButton from "react-bootstrap/CloseButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";

import InputText from "/src/util-components/InputText.jsx";
import InputCheckbox from "/src/util-components/InputCheckbox.jsx";
import InputTextPopup from "/src/util-components/InputTextPopup.jsx";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import CardDisplay from "/src/IDcard/CardDisplay";
import Profile from "/src/profile/Profile";
import handleBackup from "/src/utils/handleBackup";
import SelectSupervisors from "/src/admin/components/SelectSupervisors";

const textFields = ["name", "subject", "password"];
const selectFields = ["supervisors"];
const checkboxFields = ["roles"];
const popupFields = []; //"schedule"];
const popupTextFields = []; //"links"];
const popupCheckboxFields = []; //"courses"];
const switchFields = ["inactive"];
const allFields = [
  "username",
  ...textFields,
  ...selectFields,
  ...checkboxFields,
  ...popupTextFields,
  ...popupFields,
  ...popupCheckboxFields,
  ...switchFields,
];
const hiddenOnMobile = [
  ...textFields,
  ...selectFields,
  ...popupTextFields,
  ...popupFields,
  ...popupCheckboxFields,
];
const registerOptions = {};

export default function Admin({ info, fetchInfo, navHeight }) {
  const userData = useSelector((state) => state.userData.items);
  const activeUser = useSelector((state) => state.active.user);
  const resetCount = useRef(0);
  const [loaded, setLoaded] = useState(false);
  const [usernames, setUsernames] = useState();
  const [descending, setDescending] = useState("username");
  const [currValues, setCurrValues] = useState();
  const [selectAll, setSelectAll] = useState(false);
  const [display, setDisplay] = useState(false);
  const [supervisors, setSupervisors] = useState();
  const formUtils = useForm({
    criteriaMode: "all",
  });

  const defaultValues = useMemo(() => {
    if (Array.isArray(usernames)) {
      let entries = usernames
        .map((user) =>
          Object.entries(userData[user]).map(([field, value]) => [
            `${user} ${field}`,
            value,
          ]),
        )
        .flat();
      entries = entries.concat(
        usernames
          .map((username) => [
            [`${username} username`, username],
            [`${username} password`, null],
          ])
          .flat(),
      );
      const output = Object.fromEntries(entries);
      output.selected = false;
      return output;
    }
  }, [usernames]);

  const setInative = (boolean) => {
    const selected = formUtils.getValues("selected");
    if (selected) {
      selected.forEach((user) => {
        formUtils.setValue(`${user} inactive`, boolean);
      });
    }
  };

  const handleSortByField = (field) => {
    if (textFields.concat(["username"]).includes(field)) {
      const formValues = formUtils.getValues();
      const myKeyGen = (b) => `${b} ${field}`;
      utils.sortGenerator(
        usernames,
        formValues,
        myKeyGen,
        descending,
        setDescending,
        setUsernames,
      )(field);
      setCurrValues(formUtils.getValues());
    }
  };
  const handleReset = (values) => {
    formUtils.reset(values);
    resetCount.current++;
  };
  const handleUpdate = (data) => {
    delete data.selected;
    data = utils.getReadyForUpdate(usernames, data);
    contentful.update(null, null, data, fetchInfo);
  };
  const handleInactivate = () => {
    setInative(true);
  };

  const handleActivate = () => {
    setInative(false);
  };

  useEffect(() => {
    if (userData) {
      const userObj = {};
      Object.keys(userData).forEach((user) => {
        userObj[user] = [];
      });
      fetch(utils.apiBaseUrl + "/select-supervisors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userObj),
      })
        .then((res) => res.json())
        .then((res) => setSupervisors(res));
      setUsernames(Object.keys(userData).sort());
    }
  }, [userData]);

  useEffect(() => {
    if (defaultValues != null) {
      formUtils.reset(defaultValues);
      setLoaded(true);
    }
  }, [defaultValues]);

  useEffect(() => {
    handleReset(currValues);
  }, [descending]);

  useEffect(() => {
    formUtils.setValue("selected", selectAll ? usernames : false);
  }, [selectAll]);

  useEffect(() => {}, []); //remove

  useEffect(() => {}); //remove

  if (loaded && Array.isArray(usernames) && supervisors)
    return (
      <main>
        <form onSubmit={formUtils.handleSubmit(handleUpdate)}>
          <Table
            className="admin-container"
            striped
            borderless
            hover
            size="sm"
            style={{ textAlign: "center" }}
            responsive
          >
            <thead className="non-select">
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onClick={() => setSelectAll((state) => !state)}
                  />{" "}
                  #
                </th>
                {allFields.map((field) => (
                  <th
                    key={field}
                    onClick={() => {
                      handleSortByField(field);
                    }}
                    className={
                      hiddenOnMobile.includes(field)
                        ? "hidden-on-mobile"
                        : undefined
                    }
                  >
                    {field}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {usernames.map((username, i) => {
                const fieldNameGen = (field) => `${username} ${field}`;
                return (
                  <tr key={username + " row"}>
                    <td>
                      <span className="checkbox-group">
                        <input
                          type="checkbox"
                          id={username}
                          value={username}
                          {...formUtils.register("selected")}
                        />{" "}
                        <label htmlFor={username}>{i + 1}</label>
                      </span>
                    </td>
                    <td>
                      <Popup
                        trigger={
                          <Button style={{ width: "100%" }}>{username}</Button>
                        }
                        lockScroll={true}
                        modal
                        closeOnDocumentClick={false}
                        contentStyle={{
                          overflowY: "scroll",
                          paddingTop: navHeight + 5 + "px",
                          height: "100vh",
                          width: "auto",
                        }}
                      >
                        {(close) => {
                          return (
                            <div>
                              <div style={{ position: "fixed" }}>
                                <CloseButton onClick={close} />
                              </div>
                              <Profile
                                info={info}
                                fetchInfo={fetchInfo}
                                user={username}
                                setLoaded={() => {}}
                              />
                            </div>
                          );
                        }}
                      </Popup>
                    </td>
                    {textFields.map((field) => (
                      <td
                        key={fieldNameGen(field)}
                        className="hidden-on-mobile"
                      >
                        <InputText
                          name={fieldNameGen(field)}
                          utils={formUtils}
                          options={registerOptions}
                        />
                      </td>
                    ))}
                    {selectFields.map((field) => (
                      <td
                        key={fieldNameGen(field)}
                        className="hidden-on-mobile"
                      >
                        <SelectSupervisors
                          user={username}
                          currSupOptions={supervisors[username]}
                        />
                      </td>
                    ))}
                    {checkboxFields.map((field) => (
                      <td key={fieldNameGen(field)}>
                        <InputCheckbox
                          name={fieldNameGen(field)}
                          utils={formUtils}
                          values={fieldOptions[field]}
                          isReset={resetCount.current}
                          options={registerOptions}
                          developerOnly={true}
                        />
                      </td>
                    ))}
                    {popupTextFields.map((field) => {
                      return (
                        <td
                          key={fieldNameGen(field)}
                          className="hidden-on-mobile"
                        >
                          <InputTextPopup
                            supField={fieldNameGen(field)}
                            utils={formUtils}
                            options={registerOptions}
                          />
                        </td>
                      );
                    })}
                    {popupFields.map((field) => {
                      return (
                        <td
                          key={fieldNameGen(field)}
                          className="hidden-on-mobile"
                        ></td>
                      );
                    })}
                    {popupCheckboxFields.map((field) => {
                      return (
                        <td
                          key={fieldNameGen(field)}
                          className="hidden-on-mobile"
                        ></td>
                      );
                    })}
                    {switchFields.map((field) => {
                      return (
                        <td key={fieldNameGen(field)}>
                          <Form.Switch
                            {...formUtils.register(fieldNameGen(field))}
                          />
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <Button type="submit">Update</Button>
          <Button
            type="button"
            onClick={() => {
              handleReset(defaultValues);
            }}
          >
            Reset
          </Button>
          <Button type="button" onClick={handleInactivate}>
            Inactivate
          </Button>
          <Button type="button" onClick={handleActivate}>
            Activate
          </Button>
          <Button
            type="button"
            onClick={() => {
              setDisplay((state) => !state);
            }}
          >
            ID cards
          </Button>

          <Button
            type="Button"
            onClick={handleBackup}
            disabled={
              !(
                userData[activeUser]?.roles.admin &&
                userData[activeUser]?.roles.developer
              )
            }
          >
            <span className="button-text">Backup&nbsp;</span>{" "}
            <FontAwesomeIcon icon={faDatabase} />
          </Button>
        </form>
        <div
          style={{
            width: "100%",
            display: display ? "initial" : "none",
          }}
        >
          <CardDisplay
            pageSize="LETTER"
            pageOrientation="portrait"
            info={userData}
            toolbar={true}
          />
        </div>
      </main>
    );
  else return <div>Loading...</div>;
}
