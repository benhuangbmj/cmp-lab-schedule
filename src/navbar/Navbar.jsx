import {
	useContext,
	useRef,
	useEffect,
	useState,
	useLayoutEffect,
} from "react";
import NavbarToggle from "/src/navbar/components/NavbarToggle";
import NavbarBrand from "/src/navbar/components/NavbarBrand";
import NavbarRight from "/src/navbar/components/NavbarRight";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";
import { AppContext } from "/src/contexts/AppContext";
import { useSelector } from "react-redux";
import { selectActive } from "/src/reducers/activeReducer.js";

export default function Main() {
	const { refNav, refBrand, setNavHeight } = useContext(AppContext);
	const [didMount, setDidMount] = useState(false);
	const active = useSelector(selectActive);
	const observer = new MutationObserver(() =>
		setNavHeight(refNav.current.offsetHeight),
	);
	useEffect(() => setDidMount(true), []);
	useLayoutEffect(() => {
		if (refNav.current) {
			observer.observe(refNav.current, {
				subtree: true,
				attributeFilter: ["class"],
			});
			setNavHeight(refNav.current.offsetHeight);
		}
	}, [didMount]);
	return (
		<div
			className="hide-on-print"
			style={{
				position: "sticky",
				top: 0,
				zIndex: 1,
			}}
		>
			<Navbar
				ref={refNav}
				style={{
					width: "100%",
					padding: 0,
				}}
				data-bs-theme="dark"
				expand="xl"
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
						{active.user && <NavbarToggle />}
					</Nav>
				</Nav>
			</Navbar>
			<NavbarRight />
		</div>
	);
}
