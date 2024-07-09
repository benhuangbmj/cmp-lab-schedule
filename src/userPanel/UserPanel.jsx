import { useSelector } from "react-redux";
import { selectActive } from "/src/reducers/activeReducer.js";
import { selectUserData } from "/src/reducers/userDataReducer";
import OffcanvasWrapper from "/src/util-components/OffcanvasWrapper";
import Nav from "react-bootstrap/Nav";
import SignOut from "/src/auth/SignOut";
export default function UserPanel() {
	const userData = useSelector(selectUserData);
	const active = useSelector(selectActive);
	return (
		<Nav.Link
			style={{
				padding: "0",
				marginRight: ".25em",
			}}
		>
			<OffcanvasWrapper
				placement="end"
				trigger={
					<>
						<Nav.Item
							style={{ border: "none" }}
							className="navbar-icons flexbox-row"
						>
							<img
								src={
									userData?.items[active?.user]?.profilePic
										?.url
										? `https:${userData?.items[active?.user]?.profilePic?.url}`
										: "https://www.messiah.edu/images/4_see_your_possibilities_anew.jpg"
								}
								className="user-icon"
							/>
							<Nav.Item className="button-text">
								&nbsp; Hello,{" "}
								{userData?.items[active?.user]?.name}
							</Nav.Item>
						</Nav.Item>
					</>
				}
			>
				<SignOut />
			</OffcanvasWrapper>
		</Nav.Link>
	);
}
