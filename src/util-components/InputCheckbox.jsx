import { useEffect } from "react";
import { ErrorMessage } from "@hookform/error-message";
import { useSelector } from "react-redux";

export default function InputCheckbox({
  name,
  utils,
  options,
  values,
  isReset,
  developerOnly = false,
  adminOnly = false,
}) {
  const {
    register,
    getValues,
    setValue,
    formState: { errors },
  } = utils;
  const userData = useSelector((state) => state.userData.items);
  const activeUser = useSelector((state) => state.active.user);
  useEffect(() => {
    const currValues = getValues(name);
    if (currValues && !Array.isArray(currValues)) {
      const valueArr = Object.keys(currValues).filter((key) => currValues[key]);
      setValue(name, valueArr);
    }
  }, [isReset]);

  return (
    <div style={{ textAlign: "left", width: "auto" }}>
      {values.map((val) => (
        <span key={val} className="checkbox-group">
          <input
            disabled={
              (adminOnly && !userData[activeUser].roles.admin) ||
              (developerOnly && !userData[activeUser].roles.developer)
            }
            type="checkbox"
            id={`${name} ${val}`}
            value={val}
            {...register(name, options)}
          />
          <label htmlFor={`${name} ${val}`}>{val}</label>
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ messages }) =>
              messages && (
                <ul>
                  {Object.entries(messages).map(([type, message]) => (
                    <li
                      style={{
                        width: "fit-content",
                        fontSize: "8pt",
                        border: "1px solid",
                        color: "red",
                      }}
                      key={type}
                    >
                      {message}
                    </li>
                  ))}
                </ul>
              )
            }
          />
        </span>
      ))}
    </div>
  );
}
