import { useContext, useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateUserData } from "/src/reducers/userDataReducer";
import { AppContext } from "/src/contexts/AppContext";
import Preparation from "/src/preparation/Preparation";
import UserInterface from "/src/userInterface/UserInterface";
import useCheckOffline from "./hooks/useCheckOffline";

export default function Main() {
	const { info, loginCheck } = useContext(AppContext);
	const location = useLocation();
	const dispatch = useDispatch();

	useCheckOffline();

	useEffect(() => {
		if (info) {
			dispatch(updateUserData(info));
		}
	}, [info]);

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
