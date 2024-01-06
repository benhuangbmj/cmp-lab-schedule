import 'reactjs-popup/dist/index.css';
import _ from 'lodash';

import { useForm } from 'react-hook-form';
import { useState, useEffect, useRef } from 'react';

import Popup from 'reactjs-popup';
import InputText from './InputText';

const handleOnClose = (e, ref, isDirty) => {
  if (e && isDirty) {
    const confirmed = confirm('Your change has not been saved.');
    if (!confirmed) {
      ref.current.open();
    }
  }
}

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

  return (
    <span>
      <button type='button' onClick={() => popupRef.current.open()}>Social Media</button>
      <Popup ref={popupRef} onClose={(e) => handleOnClose(e, popupRef, !_.isEqual(subUtils.getValues(), subUtils.formState.defaultValues))}>
        <div className='modal'>
          {subFields.map((field) => {
            return (
              <p key={field}>
                <label htmlFor={field}>{field}</label>
                <InputText id={field} name={field} utils={subUtils} options={options} />
              </p>
            )
          })}
          <button type='button' onClick={() => subUtils.reset()}>Confirm</button>
          <button type='button' onClick={() => subUtils.reset()}>Reset</button>
          <button type='button' onClick={() => { subUtils.reset(); popupRef.current.close() }}>Discard</button>
        </div>
      </Popup>
    </span>
  )
}