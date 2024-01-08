import 'reactjs-popup/dist/index.css';
import _ from 'lodash';

import { useForm } from 'react-hook-form';
import { useRef } from 'react';

import InputText from './InputText';
import MyPopup from './MyPopup';



export default function inputTextPopup({ supField, utils, options }) {
  const popupRef = useRef();
  const {
    getValues: getSupValues,
    setValue: setSupValue,
  } = utils;

  const defaultValues = getSupValues(supField);
  const subFields = Object.keys(defaultValues);

  const subUtils = useForm(
    { defaultValues: defaultValues }
  );

  const handleOnClose = (e, ref, isDirty) => {
    if (e && isDirty) {
      const confirmed = confirm('Your change has not been saved.');
      if (!confirmed) {
        ref.current.open();
      }
    }
  }

  const handleConfirm = () => {
    const subValues = subUtils.getValues();
    setSupValue(supField, subValues);
    popupRef.current.close();
  }

  const handleDiscard = () => {
    subUtils.reset();
    popupRef.current.close();
  }

  const myOnClose = (e) => {
    handleOnClose(e, popupRef, !_.isEqual(subUtils.getValues(), defaultValues));
  }

  return (
    <MyPopup ref={popupRef} myOnClose={myOnClose} trigger={'Social Media'}>
      <form className='modal'>
        {subFields.map((field) => {
          return (
            <p key={field}>
              <label htmlFor={field}>{field}</label>
              <InputText id={field} name={field} utils={subUtils} options={options} />
            </p>
          )
        })}
        <button type='button' onClick={handleConfirm} >Confirm</button>
        <button type='button' onClick={() => { subUtils.reset() }}>Reset</button>
        <button type='button' onClick={handleDiscard}>Discard</button>
      </form>
    </MyPopup>
  )
}