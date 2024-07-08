import { useSelector } from "react-redux";
import { selectActive } from "/src/reducers/activeReducer.js";
import { selectUserData } from "/src/reducers/userDataReducer";
import OffcanvasWrapper from "/src/util-components/OffcanvasWrapper";
import SignOut from "/src/auth/SignOut";
export default function UserPanel() {
	const userData = useSelector(selectUserData);
	const active = useSelector(selectActive);
	return (
		<div
			className="nav-link"
			style={{
				padding: "0",
				marginRight: ".25em",
			}}
		>
			<OffcanvasWrapper
				placement="end"
				trigger={
					<>
						<div
							type="button"
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
							<div className="button-text">
								&nbsp; Hello,{" "}
								{userData?.items[active?.user]?.name}
							</div>
						</div>
					</>
				}
			>
				<SignOut />
			</OffcanvasWrapper>
		</div>
	);
}
