import '/src/App.css';
import {useState, useEffect} from 'react';
import {useForm} from 'react-hook-form';

export default function CreateTask() {
  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: {errors}
  } = useForm();

  const fields = [
    {
      label: 'Task Name',
      register: [
        'task_name',
        {requried: 'This field is required.'}
      ]
    },
    {
      label: 'User',
      register: [
        'user',
        {requried: 'This field is required.'}
      ]
    },
    {
      label: 'Type',
      register: [
        'type',
        {required: 'This field is required.'}
      ]
    },
  ];
  const handleCreateTask = (data) => {
    fetch('https://backend-lab.manifold1985.repl.co/create-task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  }
  return (
    <>
      <form onSubmit={handleSubmit(handleCreateTask)}>
        {
          fields.map(e => {
          return (
            <span key={e.label}>
              <label>{e.label}</label>
              <input type='text' {...register(...e.register)}/>
            </span>            
          )
          })
        }
        <input type='submit' value='Create Task'/>
      </form>
    </>
  )
}