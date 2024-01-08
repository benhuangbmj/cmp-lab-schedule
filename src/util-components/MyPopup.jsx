import 'reactjs-popup/dist/index.css';
import { forwardRef } from 'react';

import Popup from 'reactjs-popup';

export default forwardRef(function MyPopup({ children, myOnClose, trigger, title}, popupRef) {
  !title && (title = trigger);
  return (
    <span>
      <button type='button' onClick={() => popupRef.current.open()}>{trigger}</button>
      <Popup ref={popupRef} onClose={(e) => myOnClose(e)}>
        <h2>{trigger}</h2>
        <input autofocus style={{display: 'none'}}/>
        {children}
      </Popup>
    </span>
  )
})
