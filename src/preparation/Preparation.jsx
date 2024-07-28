import { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateActive } from "/src/reducers/activeReducer.js";
import { fetchUserData, selectUserData } from "/src/reducers/userDataReducer";
import { AppContext } from "/src/contexts/AppContext";
import { fetchKey, update3_0 } from "/src/api-operations.js";
import Spinner from "react-bootstrap/Spinner";
import utils from "/src/utils";
export default function () {
	const { setLoginCheck, info, fetchInfo } = useContext(AppContext);
	const dispatch = useDispatch();
	const userData = useSelector(selectUserData);

	useEffect(() => {
		if (!info) {
			dispatch(fetchUserData());
			fetchInfo();
		}
		checkActive();
	}, [fetchInfo]);
	useEffect(() => {
		handleLoginCheck();
	}, [userData]);

	return (
		<h1>
			Loading ... <Spinner />
		</h1>
	);

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
}
