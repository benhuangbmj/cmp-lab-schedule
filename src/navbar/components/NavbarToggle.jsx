import { useRef, useEffect, useCallback } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";
import { capitalize } from "lodash";
import { useSelector } from "react-redux";
import { selectActive } from "/src/reducers/activeReducer.js";
import { useNormalizedBasePath } from "/src/hooks/customHooks";

const routes = ["profile", "admin", "progress", "experimental", "dashboard"];
export default function NavbarToggle() {
	const basePath = useNormalizedBasePath();
	const refNavCollapse = useRef();
	const active = useSelector(selectActive);
	const DefaultItems = useCallback(
		function () {
			return (
				<>
					<NavLink className="nav-link" to={basePath}>
						Schedule
					</NavLink>
				</>
			);
		},
		[basePath],
	);
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
					<DefaultItems />
					{active.user &&
						routes.map((route) => (
							<NavLink
								key={route}
								className="nav-link"
								to={`${basePath}${route}`}
							>
								{capitalize(route)}
							</NavLink>
						))}
				</Nav>
			</Navbar.Collapse>
		</>
	);
}
