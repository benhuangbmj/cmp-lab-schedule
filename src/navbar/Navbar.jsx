import { useContext, useRef } from "react";
import NavbarToggle from "/src/navbar/components/NavbarToggle";
import NavbarBrand from "/src/navbar/components/NavbarBrand";
import NavbarRight from "/src/navbar/components/NavbarRight";
import BootstrapNavbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";
import { AppContext } from "/src/contexts/AppContext";
export default function Navbar() {
	const { refNav, navbar, refBrand } = useContext(AppContext);
	return (
		<>
			<BootstrapNavbar
				ref={refNav}
				style={{
					display: navbar ? "initial" : "none",
					zIndex: 1,
				}}
				data-bs-theme="dark"
				expand="xl"
				sticky="top"
			>
				<Nav
					className="flexbox-row bk-institutional-navy"
					style={{ alignItems: "start" }}
				>
					<Nav
						className="flexbox-row"
						style={{
							justifyContent: "flex-start",
							margin: 0,
						}}
					>
						<NavbarBrand ref={refBrand} />
						<NavbarToggle />
					</Nav>
				</Nav>
			</BootstrapNavbar>
			<NavbarRight />
		</>
	);
}
