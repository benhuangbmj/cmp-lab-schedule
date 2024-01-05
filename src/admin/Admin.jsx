import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useEffect, useState, useMemo } from 'react';

import { fieldOptions } from '/src/util';

import InputText  from '/src/util-components/InputText.jsx';
import InputCheckbox from '/src/util-components/InputCheckbox.jsx';

export default function Admin() {
  const userData = useSelector(state => state.userData.items);
  const [loaded, setLoaded] = useState(false);
  const usernames = Object.keys(userData);
  const defaultValues = useMemo(() => {
    const entries =
      usernames
        .map(user => Object.entries(userData[user])
          .map(([field, value]) => [`${user} ${field}`, value]))
        .flat();
    const output = Object.fromEntries(entries);
    return output;
  }, [userData]);



  const textFields = ['name', 'subject', 'password'];
  const checkboxFields = ['roles'];
  // displayFields add 'links', 'schedule', 'courses'

  const formUtils = useForm({
    criteriaMode: 'all',
  })

  const handleUpdate = (data) => {
    console.log(data);
  }

  useEffect(() => {
    formUtils.reset(defaultValues);
    setLoaded(true);
  }, [defaultValues]);

  useEffect(() => {
    console.log(fieldOptions);
  },[])

  if (loaded)
    return (
      <>
        
        <form onSubmit={formUtils.handleSubmit(handleUpdate)}>
          {usernames.map(username =>
            <div key={username}>
              <span>{username}</span>
              {textFields.map(field => <InputText key={field} name={`${username} ${field}`} utils={formUtils} />)}
              {checkboxFields.map(field => <InputCheckbox key={field} name={`${username} ${field}`} utils={formUtils}/>)}
            </div>
          )}
          <button type='submit'>Update</button>
          <button type='button' onClick={() => formUtils.reset()}>Reset</button>
        </form>
      </>
    )
  else return <div>Loading...</div>
}