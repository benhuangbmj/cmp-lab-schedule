import {useEffect} from 'react';
import {ErrorMessage} from '@hookform/error-message';

export default function InputCheckbox({ name, utils, options, values, isReset}) {
  const {
    register,
    getValues,
    setValue,
    formState: { errors },
  } = utils;
 
  useEffect(() => {
    const currValues = getValues(name);
    if(currValues && !Array.isArray(currValues)) {
    const valueArr = Object.keys(currValues).filter(key => currValues[key]);
    setValue(name, valueArr);
    }
  }, [isReset])
  
  return values.map((val) =>
    <span key={val} className='checkbox-group'>
      <input type='checkbox' id={`${name} ${val}`} value={val} {...register(name, options)} />
      <label htmlFor={`${name} ${val}`}>{val}</label>
      <ErrorMessage 
      errors = {errors} 
      name ={ name }
      render={({messages}) => 
        messages && <ul>
          {Object.entries(messages).map(([type, message]) => <li style={{width:'fit-content', fontSize: '8pt', border: "1px solid", color: 'red'}} key={type}>{message}</li>)}          
        </ul>          
      }/>
    </span>
  )
}
