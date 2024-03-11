import "/src/App.css";

import utils from "/src/utils";

import { useState, useEffect, useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

export default function CreateTask() {
  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const activeUser = useSelector((state) => state.active.user);
  const userData = useSelector((state) => state.userData.items);
  const [userWithName, setUserWithName] = useState();
  const fields = [
    {
      label: "Title",
      register: ["task_name", { requried: "This field is required." }],
    },

    {
      label: "Type",
      register: ["type", { required: "This field is required." }],
    },
    {
      label: "Assign To",
      register: ["user", { requried: "This field is required." }],
    },
  ];

  const handleCreateTask = (data) => {
    fetch(utils.apiBaseUrl + "/create-task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => console.log(res));
    console.log(data); //remove
  };

  useLayoutEffect(() => {
    if (activeUser) {
      try {
        fetch(utils.apiBaseUrl + `/supervisees?user=${activeUser}`)
          .then((res) => {
            res.json().then((data) => {
              const users = Array.from(data);
              users.push(activeUser);
              const output = [];
              users.forEach((user) => {
                if (userData[user])
                  output.push({ name: userData[user].name, user: user });
              });
              utils.sortByLastName(output, ["name"]);
              setUserWithName(output);
            });
          })
          .catch((err) => console.log(err));
      } catch (err) {
        console.log(err);
      }
    }
  }, [activeUser]);
  return (
    <>
      <form onSubmit={handleSubmit(handleCreateTask)}>
        {fields.map((e) => {
          const output =
            e.register[0] == "user" ? (
              <span key={e.label}>
                <label htmlFor={e.label}>{e.label}</label>&nbsp;
                <select id={e.label} {...register(...e.register)}>
                  {userWithName &&
                    userWithName.map((e) => (
                      <option key={e.user} value={e.user}>
                        {`${e.name} (${e.user})`}{" "}
                      </option>
                    ))}
                </select>
              </span>
            ) : (
              <span key={e.label}>
                <label htmlFor={e.label}>{e.label}</label>&nbsp;
                <input id={e.label} type="text" {...register(...e.register)} />
              </span>
            );
          return output;
        })}
        &nbsp;
        <label htmlFor="duration">Duration</label>{" "}
        <select id="duration">
          {Array.from(Array(10), (e, i) => i + 1).map((e) => (
            <option key={`duration ${e}`} value={e}>
              {e} hr
            </option>
          ))}
        </select>{" "}
        &nbsp;
        <input type="submit" value="Create Task" />
      </form>
    </>
  );
}
