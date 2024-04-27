import "/src/App.css";

import utils from "/src/utils";

import { useState, useEffect, useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import Button from "react-bootstrap/Button";
import AsteriskLabel from "/src/util-components/AsteriskLabel";

export default function CreateTask({ task }) {
  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    defaultValues: task
      ? {
          task_name: task.task_name,
          type: task.type,
          user: task.user,
          duration: task.duration,
          task_id: task.task_id,
        }
      : {},
  });
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
  ];

  const selectFields = [
    {
      label: "Assign To",
      register: ["user", { requried: "This field is required." }],
      options: function () {
        return (
          userWithName &&
          userWithName.map((e, i) => {
            return (
              <option
                key={this.register[0] + " " + e.user}
                value={e.user}
                selected={e.user == getValues("user")}
              >
                {`${e.name} (${e.user})`}
              </option>
            );
          })
        );
      },
    },
    {
      label: "Duration",
      register: ["duration", { requried: "This field is required." }],
      options: function () {
        return Array.from(Array(10), (e, i) => i + 1).map((e) => (
          <option key={`${this.register[0]} ${e}`} value={e}>
            {e} hr
          </option>
        ));
      },
    },
  ];

  const handleCreateTask = (data) => {
    data.created_by = activeUser;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    if (task) {
      fetch(utils.apiBaseUrl + "/edit-task", options);
    } else {
      fetch(utils.apiBaseUrl + "/create-task", options).then(() => {
        reset();
      });
    }
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
  useEffect(() => {
    if (!task) setValue("duration", 3);
  }, []);
  useEffect(() => {
    if (!task && userWithName) {
      setValue("user", userWithName[0].user);
    }
  }, [userWithName]);
  return (
    <form onSubmit={handleSubmit(handleCreateTask)}>
      <h3 className="center-fit">
        {task ? "Edit the Existing Task" : "Create a New Task"}
      </h3>
      <div
        className="flexbox-column"
        style={{
          alignItems: "flex-start",
          width: "fit-content",
        }}
      >
        {fields.map((e) => {
          const output = (
            <div
              key={e.label}
              className="flexbox-row"
              style={{
                justifyContent: "flex-start",
                margin: ".5em 0",
              }}
            >
              <AsteriskLabel
                htmlFor={e.label}
                style={{ marginRight: "1em", width: "80px" }}
              >
                {e.label}
              </AsteriskLabel>
              <input
                id={e.label}
                type="text"
                {...register(...e.register)}
                style={{ maxWidth: "50vw" }}
              />
            </div>
          );
          return output;
        })}
        {selectFields.map((e) => {
          return (
            <div
              key={e.label}
              className="flexbox-row"
              style={{
                justifyContent: "flex-start",
                margin: ".5em 0px",
              }}
            >
              <AsteriskLabel
                htmlFor={e.label}
                style={{ marginRight: "1em", width: "80px" }}
              >
                {e.label}
              </AsteriskLabel>
              <select
                id={e.label}
                {...register(...e.register)}
                style={{ maxWidth: "50vw" }}
              >
                {e.options()}
              </select>
            </div>
          );
        })}
      </div>
      <Button type="submit" style={{ margin: "1em auto", display: "block" }}>
        {task ? "Edit" : "Create"}
      </Button>
    </form>
  );
}
