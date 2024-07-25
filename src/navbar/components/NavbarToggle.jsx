import { useContext, useRef } from "react";
const routes = ["profile", "admin", "progress", "experimental"];
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";
import { capitalize } from "lodash";
import { useSelector } from "react-redux";
import { selectActive } from "/src/reducers/activeReducer.js";

export default function NavbarToggle() {
	const refNavCollapse = useRef();
	const active = useSelector(selectActive);
	return (
		<>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse style={{ width: "0px" }}>
				<Nav ref={refNavCollapse}>
					{!active.user ? (
						<DefaultItem />
					) : (
						<>
							<DefaultItem />
							{routes.map((route) => (
								<NavLink
									key={route}
									className="nav-link"
									to={`/${route}`}
								>
									{capitalize(route)}
								</NavLink>
							))}
						</>
					)}
				</Nav>
			</Navbar.Collapse>
		</>
	);
}

function DefaultItem() {
	return (
		<>
			<NavLink className="nav-link" to="/">
				Schedule
			</NavLink>
			<NavLink to="/dashboard" className="nav-link">
				Dashboard
			</NavLink>
		</>
	);
}
