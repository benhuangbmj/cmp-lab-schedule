import 'reactjs-popup/dist/index.css';


import { useForm } from 'react-hook-form';

import InputText from './InputText';
import MyPopup from './MyPopup';

export default function inputTextPopup({ supField, utils, options }) {
  const defaultValues = utils.getValues(supField);
  const subFields = Object.keys(defaultValues);

  const subUtils = useForm(
    { defaultValues: defaultValues }
  );

  return (
    <MyPopup trigger={'Social Media'} supUtils={utils} subUtils={subUtils} supField = {supField}> 
      {subFields.map((field) => {
        return (
          <p key={field}>
            <label htmlFor={field}>{field}</label>
            <InputText id={field} name={field} utils={subUtils} options={options} />
          </p>
        )
      })}
    </MyPopup>
  )
}