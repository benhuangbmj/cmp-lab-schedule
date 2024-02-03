import { memo } from "react";
import { sortByLastName } from "../utils";

import Select from "react-select";
import makeAnimated from "react-select/animated";

export default memo(SelectUser);

function SelectUser({ info, handleSelect }) {
  const userNames = [];
  Object.entries(info).forEach((e) => {
    userNames.push({ value: e[0], label: e[1].name });
  });
  sortByLastName(userNames, ["label"]);

  return (
    <>
      <Select
        isClearable={true}
        isSearchable={true}
        placeholder="Select a user ..."
        className="select"
        options={userNames}
        onChange={handleSelect}
      />
    </>
  );
}
