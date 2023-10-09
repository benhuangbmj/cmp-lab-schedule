import {memo} from 'react';
import {sortByLastName} from '../util';

import Select from "react-select";


export default memo(SelectTutor);

function SelectTutor({info, handleSelect}) {
  const tutorNames = [];
  Object.entries(info).forEach(e => {
      tutorNames.push({ value: e[0], label: e[1].name });
  });
  sortByLastName(tutorNames, ['label']);

  return (
    <>
      <label>Select tutor </label>
      <Select className="select" options={tutorNames} onChange={handleSelect}/>
    </>
  )
}