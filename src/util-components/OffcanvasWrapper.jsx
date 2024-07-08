import { useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";

function OffcanvasWrapper({
  trigger,
  triggerClassName = "",
  title,
  children,
  placement,
}) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div className={triggerClassName} onClick={handleShow}>
        {trigger}
      </div>
      <Offcanvas show={show} onHide={handleClose} placement={placement}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{title}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>{children}</Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default OffcanvasWrapper;
