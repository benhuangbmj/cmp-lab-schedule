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
const userInfoId = import.meta.env.VITE_USER_INFO_ID; //to distinguish from other JSON file (e.g. the backup file)

export default function () {
	const {
		setLoginCheck,
		info,
		fetchInfo,
		basePath,
		dispatchFetchInfo,
		update,
	} = useContext(AppContext);
	const dispatch = useDispatch();
	const userData = useSelector(selectUserData);
	useEffect(() => {
		if (fetchInfo) {
			fetchInfo();
		}
	}, [fetchInfo]);
	useEffect(() => {
		if (basePath == "/dept/demo" && userData.status == "succeeded") {
			dispatch(updateActive("demouser"));
			setLoginCheck(true);
		} else {
			handleLoginCheck();
		}
	}, [userData]);

	function handleLoginCheck() {
		if (userData.status == "succeeded") {
			const users = Object.keys(userData.items);
			fetch(utils.apiBaseUrl + "/login", { credentials: "include" })
				.then((res) => {
					return res.json();
				})
				.then((res) => {
					if (res) {
						if (!users.includes(res.user)) {
							const newUser = { ...utils.schema };
							Object.assign(newUser, res.profile);
							update({
								targetKey: res.user,
								keys: [],
								value: newUser,
								fetchInfo: fetchInfo,
							});
						}
						dispatch(updateActive(res.user));
					}
				})
				.catch((err) => {
					console.error(err);
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
