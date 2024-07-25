import { forwardRef } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";
export default forwardRef(function ({ brand }, ref) {
	return (
		<Nav.Item ref={ref}>
			<NavLink className="nav-link" to="/">
				<Navbar.Brand>
					<span className="shrink-on-mobile">CMP-Lab@Messiah</span>
				</Navbar.Brand>
			</NavLink>
		</Nav.Item>
	);
});
