import { forwardRef } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";
import { useNormalizedBasePath } from "/src/hooks/customHooks";
export default forwardRef(function ({ brand }, ref) {
	const basePath = useNormalizedBasePath();
	return (
		<Nav.Item style={{ paddingLeft: "1em" }} ref={ref}>
			<NavLink className="nav-link" to={basePath}>
				<Navbar.Brand>
					<span className="shrink-on-mobile">CMP-Lab@Messiah</span>
				</Navbar.Brand>
			</NavLink>
		</Nav.Item>
	);
});
