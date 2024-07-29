import { useState, useEffect, useContext } from "react";
import { Route, Routes, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateActive } from "/src/reducers/activeReducer.js";
import { fetchUserData, selectUserData } from "/src/reducers/userDataReducer";
import { AppContext } from "/src/contexts/AppContext";
import { fetchKey, update3_0 } from "/src/api-operations.js";
import Spinner from "react-bootstrap/Spinner";
import Reroute from "/src/routes/components/Reroute";
import Schedule from "/src/Schedule";
import utils from "/src/utils";
const userInfoId = import.meta.env.VITE_USER_INFO_ID; //to distinguish from other JSON file (e.g. the backup file)

export default function () {
	const { setLoginCheck, info, fetchInfo, basePath, dispatchFetchInfo } =
		useContext(AppContext);
	const dispatch = useDispatch();
	const userData = useSelector(selectUserData);
	useEffect(() => {
		if (basePath == "/") {
			dispatchFetchInfo({
				type: "set_id",
				payload: userInfoId,
			});
		}
	}, [basePath]);
	useEffect(() => {
		if (fetchInfo) {
			dispatch(fetchUserData());
			fetchInfo();
		}
		checkActive();
	}, [fetchInfo]);
	useEffect(() => {
		handleLoginCheck();
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
							update3_0({
								targetKey: res.user,
								keys: [],
								value: newUser,
								fetchInfo: fetchInfo,
								next: () => {
									dispatch(fetchUserData());
								},
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
	async function checkActive() {
		const cookieStr = document.cookie.split(";");
		const cookie = {};
		let activeUser = null;
		cookieStr.forEach((str) => {
			const [key, value] = str.split("=");
			cookie[key.trim()] = value;
		});
		if (cookie.activeUser != null) {
			const userStatus = await fetchKey(cookie.activeUser, "status");
			if (userStatus.code == cookie.activeStatus) {
				activeUser = cookie.activeUser;
			}
		}
		dispatch(updateActive(activeUser));
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
