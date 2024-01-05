import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useEffect, useState, useMemo, useRef } from 'react';

import { fieldOptions } from '/src/util';

import InputText from '/src/util-components/InputText.jsx';
import InputCheckbox from '/src/util-components/InputCheckbox.jsx';

const textFields = ['name', 'subject', 'password'];
const checkboxFields = ['roles'];
const popupFields = ['links', 'schedule', 'courses'];
const allFields = ['username', ...textFields, ...checkboxFields, ...popupFields];

export default function Admin() {

  const userData = useSelector(state => state.userData.items);
  const usernames = Object.keys(userData);

  const handleReset = () => {
    formUtils.reset();
    resetCount.current++;
  }
  const handleUpdate = (data) => {
    console.log(data);
  }
  const resetCount = useRef(0);
  const [loaded, setLoaded] = useState(false);
  const defaultValues = useMemo(() => {
    const entries =
      usernames
        .map(user => Object.entries(userData[user])
          .map(([field, value]) => [`${user} ${field}`, value]))
        .flat();
    const output = Object.fromEntries(entries);
    return output;
  }, [userData]);

  const formUtils = useForm({
    criteriaMode: 'all',
  })



  useEffect(() => {
    formUtils.reset(defaultValues);
    setLoaded(true);
  }, [defaultValues]);

  useEffect(() => {
  }, [])//delete

  useEffect(() => {
  })//delete

  if (loaded)
    return (
      <>
        <div style={{ overflow: 'hidden', marginTop: '12pt', height: '24pt', width: '800px' }}>
          {allFields.map(field => <span style={{ display: 'inline-block', border: '1px solid', marginRight: '1in', marginBottom: '24pt' }} key={field}>{field}</span>)}
        </div>

        <form onSubmit={formUtils.handleSubmit(handleUpdate)}>
          {usernames.map(username =>
            <div key={username}>
              <span>{username}</span>
              {textFields.map(field => <InputText key={field} name={`${username} ${field}`} utils={formUtils} />)}
              {checkboxFields.map(field => <InputCheckbox key={field} name={`${username} ${field}`} utils={formUtils} values={fieldOptions[field]} isReset={resetCount.current} />)}
            </div>
          )}
          <button type='submit'>Update</button>
          <button type='button' onClick={handleReset}>Reset</button>
        </form>
      </>
    )
  else return <div>Loading...</div>
}