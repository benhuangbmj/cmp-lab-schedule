import { capitalize } from "lodash";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectActive } from "/src/reducers/activeReducer.js";

function OffcanvasMenu({ root, routes }) {
  const [show, setShow] = useState(false);
  const active = useSelector(selectActive);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Navbar.Toggle style={!active.user ? { display: "none" } : {}} />
      <Navbar.Offcanvas>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Offcanvas</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {active.user && (
            <Nav>
              <NavLink className="nav-link" to="/">
                {capitalize(root)}
              </NavLink>
              {routes.map((route) => (
                <NavLink key={route} className="nav-link" to={`/${route}`}>
                  {capitalize(route)}
                </NavLink>
              ))}
            </Nav>
          )}
        </Offcanvas.Body>
      </Navbar.Offcanvas>
    </>
  );
}

export default OffcanvasMenu;
