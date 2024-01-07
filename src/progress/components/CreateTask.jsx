import '/src/App.css';

import utils from '/src/utils';

import { useState, useEffect, useLayoutEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

export default function CreateTask() {
  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const activeUser = useSelector(state => state.active.user);
  const userData = useSelector(state => state.userData.items);
  const [userWithName, setUserWithName] = useState();
  const fields = [
    {
      label: 'User',
      register: [
        'user',
        { requried: 'This field is required.' }
      ]
    },
    {
      label: 'Task Name',
      register: [
        'task_name',
        { requried: 'This field is required.' }
      ]
    },

    {
      label: 'Type',
      register: [
        'type',
        { required: 'This field is required.' }
      ]
    },
  ];

  const handleCreateTask = (data) => {
    fetch(utils.apiBaseUrl + '/create-task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(res => console.log(res));
    console.log(data);
  }

  useLayoutEffect(() => {
    if (activeUser) {
      try {
        fetch(utils.apiBaseUrl + `/supervisees?user=${activeUser}`).then(res => {
          res.json().then(data => {
            const users = Array.from(data);
            users.push(activeUser);
            const output = [];
            users.forEach(user => { if (userData[user]) output.push({ name: userData[user].name, user: user }) });
            setUserWithName(output);
          });
        }).catch(err => console.log(err));
      } catch (err) {
        console.log(err);
      }      
    }
  }, [activeUser]);
  return (
    <>
      <form onSubmit={handleSubmit(handleCreateTask)}>
        {
          fields.map((e) => {
            const output = e.register[0] == 'user' ?
              <span key={e.label}>
                <label htmlFor={e.label}>{e.label}</label>
                <select id={e.label} {...register(...e.register)}>
                  {userWithName && userWithName.map(e => <option key={e.user} value={e.user}>{`${e.name} (${e.user})`} </option>)}
                </select>
              </span> :
              <span key={e.label}>
                <label htmlFor={e.label}>{e.label}</label>
                <input id={e.label} type='text' {...register(...e.register)} />
              </span>
            return output;
          })
        }
        <input type='submit' value='Create Task' />
      </form>
    </>
  )
}