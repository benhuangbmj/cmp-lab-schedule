import { useRef, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";
import { capitalize } from "lodash";
import { useSelector } from "react-redux";
import { selectActive } from "/src/reducers/activeReducer.js";
import { useNormalizedBasePath } from "/src/hooks/customHooks";

const routes = ["profile", "admin", "progress", "experimental"];
export default function NavbarToggle() {
	const basePath = useNormalizedBasePath();
	const refNavCollapse = useRef();
	const active = useSelector(selectActive);
	useEffect(() => {
		const navbarToggler = document.querySelector("button.navbar-toggler");
		if (refNavCollapse.current) {
			const children = Array.from(refNavCollapse.current.children);
			children.forEach((child) => {
				child.onclick = () => {
					navbarToggler.click();
				};
			});
		}
	}, []);
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
									to={`${basePath}${route}`}
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
	function DefaultItem() {
		return (
			<>
				<NavLink className="nav-link" to={basePath}>
					Schedule
				</NavLink>
				<NavLink to={basePath + "dashboard"} className="nav-link">
					Dashboard
				</NavLink>
			</>
		);
	}
}
