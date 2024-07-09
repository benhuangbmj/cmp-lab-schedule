import { useRef } from "react";
import { useSelector } from "react-redux";
import { selectActive } from "/src/reducers/activeReducer.js";
import { selectUserData } from "/src/reducers/userDataReducer";
import OffcanvasWrapper from "/src/util-components/OffcanvasWrapper";
import Nav from "react-bootstrap/Nav";
import SignOut from "/src/auth/SignOut";
export default function UserPanel({ height }) {
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
					<Nav>
						<Nav.Item
							style={{
								border: "none",
								height: height ? height : "auto",
							}}
							className="flexbox-row"
						>
							<img
								src={
									userData?.items[active?.user]?.profilePic
										?.url
										? `https:${userData?.items[active?.user]?.profilePic?.url}`
										: "https://www.messiah.edu/images/4_see_your_possibilities_anew.jpg"
								}
								className="user-icon"
								style={{
									boxSizing: "border-box",
									height: "85%",
								}}
							/>
							<Nav.Item className="button-text">
								&nbsp; Hello,{" "}
								{userData?.items[active?.user]?.name}
							</Nav.Item>
						</Nav.Item>
					</Nav>
				}
			>
				<SignOut />
			</OffcanvasWrapper>
		</Nav.Link>
	);
}
