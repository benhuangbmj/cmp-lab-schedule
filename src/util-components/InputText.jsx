import {ErrorMessage} from '@hookform/error-message';
export default function InputText({name, utils, options}) {
  const {
    register,
    formState: {errors},
  } = utils;
  
  return (
    <span style = {{border: '1px solid'}}>
      <input {...register(name, options)}></input>
      <ErrorMessage 
      errors = {errors} 
      name ={ name }
      render={({messages}) => 
        messages && <ul>
          {Object.entries(messages).map(([type, message]) => <li style={{width:'fit-content', fontSize: '8pt', border: "1px solid", color: 'red'}} key={type}>{message}</li>)}          
        </ul>          
      } />
    </span>
  )
}