import { forwardRef, useContext } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";
import { useNormalizedBasePath } from "/src/hooks/customHooks";
import { AppContext } from "/src/contexts/AppContext";
export default forwardRef(function ({}, ref) {
	const basePath = useNormalizedBasePath();
	const { brand } = useContext(AppContext);
	return (
		<Nav.Item style={{ paddingLeft: "1em" }} ref={ref}>
			<NavLink className="nav-link" to={basePath}>
				<Navbar.Brand>
					<span className="shrink-on-mobile">{brand}</span>
				</Navbar.Brand>
			</NavLink>
		</Nav.Item>
	);
});
