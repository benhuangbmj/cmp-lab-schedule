import { useState, useEffect, useContext } from "react";
import { Route, Routes, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateActive } from "/src/reducers/activeReducer.js";
import { selectUserData } from "/src/reducers/userDataReducer";
import { AppContext } from "/src/contexts/AppContext";
import Spinner from "react-bootstrap/Spinner";
import Reroute from "/src/routes/components/Reroute";
import Schedule from "/src/Schedule";
import utils from "/src/utils";
import sendEmail from "/src/utils/sendEmail";
const userInfoId = import.meta.env.VITE_USER_INFO_ID; //to distinguish from other JSON file (e.g. the backup file)

export default function () {
	const {
		setLoginCheck,
		info,
		fetchInfo,
		basePath,
		dispatchFetchInfo,
		update,
		loginCheck,
	} = useContext(AppContext);
	const dispatch = useDispatch();
	const userData = useSelector(selectUserData);
	useEffect(() => {
		if (fetchInfo) {
			fetchInfo();
		}
	}, [fetchInfo]);
	useEffect(() => {
		if (!loginCheck) {
			if (basePath == "/dept/demo" && userData.status == "succeeded") {
				dispatch(updateActive("demouser"));
				setLoginCheck(true);
			} else {
				handleLoginCheck();
			}
		}
	}, [userData]);
	function handleLoginCheck() {
		if (userData.status == "succeeded") {
			const users = Object.keys(userData.items);
			fetch(utils.apiBaseUrl + "/login", { credentials: "include" })
				.then((res) => {
					if (!res.ok) {
						throw new Error(res.statusText);
					}
					return res.json();
				})
				.then((res) => {
					if (res) {
						if (!users.includes(res.user)) {
							sendEmail(
								import.meta.env.VITE_ERROR_RECEIVER,
								`A new user ${res.user} just signed up!`,
							);
							const newUser = { ...utils.schema };
							Object.assign(newUser, res.profile);
							update({
								targetKey: res.user,
								keys: [],
								value: newUser,
								fetchInfo: fetchInfo,
							}).catch((err) => {
								console.error(err);
								sendEmail(
									import.meta.env.VITE_ERROR_RECEIVER,
									`New user signing up, ${err.message}, ${JSON.stringify(err.stack)}`,
								);
							});
						}
						dispatch(updateActive(res.user));
						return res;
					}
				})
				.catch((err) => {
					console.warn(err);
				})
				.finally(() => {
					setLoginCheck(true);
				});
		}
	}

	return (
		<main>
			<h1>
				Loading ... <Spinner />
			</h1>
			<Routes>
				<Route path="/dept/:id/*" element={<Reroute />} />
				<Route path="*" element={<Reroute />} />
			</Routes>
		</main>
	);
}
