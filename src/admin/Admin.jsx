import devTools from '/src/devTools';//delete

import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useEffect, useState, useMemo, useRef } from 'react';

import utils, { fieldOptions } from '/src/utils';

import InputText from '/src/util-components/InputText.jsx';
import InputCheckbox from '/src/util-components/InputCheckbox.jsx';
import InputTextPopup from '/src/util-components/InputTextPopup.jsx';


const textFields = ['name', 'subject', 'password'];
const checkboxFields = ['roles'];
const popupFields = ['schedule'];
const popupTextFields = ['links'];
const popupCheckboxFields = ['courses'];
const allFields = ['username', ...textFields, ...checkboxFields, ...popupTextFields, ...popupFields];
const registerOptions = {}

export default function Admin() {
  const userData = useSelector(state => state.userData.items);

  const resetCount = useRef(0);
  const [loaded, setLoaded] = useState(false);
  const [usernames, setUsernames] = useState();
  const [descending, setDescending] = useState('username');
  const [currValues, setCurrValues] = useState();
  const formUtils = useForm({
    criteriaMode: 'all',
  })

  const defaultValues = useMemo(() => {
    if (Array.isArray(usernames)) {
      let entries =
        usernames
          .map(user => Object.entries(userData[user])
            .map(([field, value]) => [`${user} ${field}`, value]))
          .flat();
      entries = entries.concat(usernames.map(username => [[`${username} username`, username], [`${username} password`, null]]).flat());
      const output = Object.fromEntries(entries);
      return output;
    }
  }, [usernames]);

  const handleSortByField = (field) => {
    if (textFields.concat(['username']).includes(field)) {
      const formValues = formUtils.getValues();
      const myKeyGen = (b) => `${b} ${field}`;
      utils.sortGenerator(usernames, formValues, myKeyGen, descending, setDescending, setUsernames)(field);
      setCurrValues(formUtils.getValues());
    }
  }
  const handleReset = (values) => {
    formUtils.reset(values);
    resetCount.current++;
  }
  const handleUpdate = (data) => {
    console.log(data)//delete
    data = utils.getReadyForUpdate(usernames, data);
  }

  useEffect(() => {
    setUsernames(Object.keys(userData).sort())
  }, [userData]);

  useEffect(() => {
    if (defaultValues != null) {
      formUtils.reset(defaultValues);
      setLoaded(true);
    }
  }, [defaultValues]);

  useEffect(() => {
    handleReset(currValues);
  }, [descending])

  useEffect(() => {

  }, [])//delete

  useEffect(() => {

  })//delete

  if (loaded && Array.isArray(usernames))
    return (
      <>
        <div style={{ overflow: 'hidden', marginTop: '12pt', height: '24pt', width: '950px' }}>
          {allFields.map(field => <span style={{ display: 'inline-block', border: '1px solid', marginRight: '1in', marginBottom: '24pt' }} key={field} onClick={() => { handleSortByField(field) }} >{field}</span>)}
        </div>

        <form onSubmit={formUtils.handleSubmit(handleUpdate)}>
          {usernames.map(username => {
            const fieldNameGen = (field) => `${username} ${field}`;
            return (
              <div key={username}>
                <span>{username}</span>
                {textFields.map(field => <InputText key={field} name={fieldNameGen(field)} utils={formUtils} options={registerOptions} />)}
                {checkboxFields.map(field => <InputCheckbox key={field} name={fieldNameGen(field)} utils={formUtils} values={fieldOptions[field]} isReset={resetCount.current} options={registerOptions} />)}
                {popupTextFields.map(field => {                  
                  return (<InputTextPopup key={field} supField={fieldNameGen(field)} utils={formUtils} options={registerOptions}/>)
                })}
              </div>
            )
          }
          )}
          <button type='submit'>Update</button>
          <button type='button' onClick={() => { handleReset(defaultValues) }}>Reset</button>
        </form>
      </>
    )
  else return <div>Loading...</div>
}