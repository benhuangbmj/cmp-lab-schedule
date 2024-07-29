import { useContext } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { AppContext } from "/src/contexts/AppContext";
import Preparation from "/src/preparation/Preparation";
import UserInterface from "/src/userInterface/UserInterface";
export default function () {
	const { info, loginCheck } = useContext(AppContext);
	const location = useLocation();
	if (!info || !loginCheck) {
		return <Preparation />;
	}
	if (location.state?.from) {
		return (
			<Navigate
				to="/login"
				state={{ to: location.state.from.pathname }}
			/>
		);
	}
	return <UserInterface />;
}
