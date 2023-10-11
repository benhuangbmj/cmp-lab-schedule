import {memo} from 'react';
import {sortByLastName} from '../util';

import Select from "react-select";
import makeAnimated from "react-select/animated";

export default memo(SelectTutor);

function SelectTutor({info, handleSelect}) {
  const tutorNames = [];
  Object.entries(info).forEach(e => {
      tutorNames.push({ value: e[0], label: e[1].name });
  });
  sortByLastName(tutorNames, ['label']);

  return (
    <>      
      <Select isClearable={true} isSearchable={true} placeholder="Select a tutor ..." className="select" options={tutorNames} onChange={handleSelect}/>
    </>
  )
}