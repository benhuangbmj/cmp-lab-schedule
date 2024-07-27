import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faUser,
	faIdCard,
	faCameraRetro,
} from "@fortawesome/free-solid-svg-icons";
import { AppContext } from "/src/contexts/AppContext";
import UserPanel from "/src/userPanel/UserPanel";
import NavDropdown from "react-bootstrap/NavDropdown";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectActive } from "/src/reducers/activeReducer.js";
import { useNormalizedBasePath } from "/src/hooks/customHooks";

export default function () {
	const basePath = useNormalizedBasePath();
	const { refBrand } = useContext(AppContext);
	const active = useSelector(selectActive);
	const [didMount, setDidMount] = useState(false);
	useEffect(() => {
		setDidMount(true);
	}, []);
	return (
		<Navbar data-bs-theme="dark">
			<Nav
				className="flexbox-row"
				style={{
					position: "fixed",
					top: "0",
					right: "0",
				}}
			>
				<NavDropdown
					className="button-text"
					title="Student check in"
					id="student-check-in"
				>
					<NavDropdown.Item>
						<NavLink
							className="nav-link"
							style={{ paddingLeft: 0 }}
							to={basePath + "checkinwithid"}
						>
							with ID (Demo) &nbsp;
							<FontAwesomeIcon icon={faIdCard} />
						</NavLink>
					</NavDropdown.Item>
					<NavDropdown.Item>
						<NavLink
							className="nav-link"
							style={{ paddingLeft: 0 }}
							to={basePath + "checkinwithface"}
						>
							with face (Demo) &nbsp;
							<FontAwesomeIcon icon={faCameraRetro} />
						</NavLink>
					</NavDropdown.Item>
					<NavDropdown.Item disabled>with form</NavDropdown.Item>
				</NavDropdown>
				<Nav.Item
					className="mobile-only"
					style={{ padding: "0 .25em" }}
				>
					<NavLink
						className="nav-link"
						to={basePath + "checkinwithid"}
					>
						<FontAwesomeIcon icon={faIdCard} />
					</NavLink>
				</Nav.Item>
				<Nav.Item
					className="mobile-only"
					style={{ padding: "0 .25em" }}
				>
					<NavLink
						className="nav-link"
						to={basePath + "checkinwithface"}
					>
						<FontAwesomeIcon icon={faCameraRetro} />
					</NavLink>
				</Nav.Item>
				{!active.user ? (
					<NavLink className="nav-link" to={basePath + "login"}>
						<Nav.Item style={{ float: "right", padding: ".25em" }}>
							<span className="button-text">Log in</span>{" "}
							<span>
								<FontAwesomeIcon icon={faUser} />
							</span>
						</Nav.Item>
					</NavLink>
				) : (
					didMount && (
						<UserPanel height={refBrand.current?.clientHeight} />
					)
				)}
			</Nav>
		</Navbar>
	);
}
