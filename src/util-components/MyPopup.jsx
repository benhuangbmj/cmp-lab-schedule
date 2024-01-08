import 'reactjs-popup/dist/index.css';
import _ from 'lodash';

import { useRef } from 'react';

import Popup from 'reactjs-popup';

const handleOnClose = (e, ref, isDirty) => {
  if (e && isDirty) {
    const confirmed = confirm('Your change has not been saved.');
    if (!confirmed) {
      ref.current.open();
    }
  }
}



export default function MyPopup({ children, trigger, title, supUtils, subUtils, supField}) {
  !title && (title = trigger);
  const popupRef = useRef();
  const {
    setValue: setSupValue,
    getValues: getSupValues,
  } = supUtils;
  const defaultValues = getSupValues(supField);

  const handleConfirm = () => {
    const subValues = subUtils.getValues();
    setSupValue(supField, subValues);
    popupRef.current.close();
  }

  const handleDiscard = () => {
    subUtils.reset();
    popupRef.current.close();
  }

  return (
    <span>
      <button type='button' onClick={() => popupRef.current.open()}>{trigger}</button>
      <Popup ref={popupRef} onClose={(e) => handleOnClose(e, popupRef, !_.isEqual(subUtils.getValues(), defaultValues))}>
        <h2>{trigger}</h2>
        <input autoFocus style={{ display: 'none' }} />
        <form className='modal'>
          {children}
          <button type='button' onClick={handleConfirm} >Confirm</button>
          <button type='button' onClick={() => { subUtils.reset() }}>Reset</button>
          <button type='button' onClick={handleDiscard}>Discard</button>
        </form>
      </Popup>
    </span>
  )
}
