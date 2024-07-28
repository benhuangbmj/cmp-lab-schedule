const userInfoId = import.meta.env.VITE_USER_INFO_ID; //to distinguish from other JSON file (e.g. the backup file)

import React from "react";
export const AppContext = React.createContext(null);
import { useErrorBoundary } from "react-error-boundary";
import { fetchInfo as preFetchInfo } from "/src/api-operations.js";
export const AppContextProvider = function ({ children }) {
	const refNav = React.useRef();
	const refBrand = React.useRef();
	const [navbar, setNavbar] = React.useState(true);
	const [navHeight, setNavHeight] = React.useState();
	const [info, setInfo] = React.useState(null);
	const [courseTutor, setCourseTutor] = React.useState(null);
	const [shifts, setShifts] = React.useState(null);
	const [loginCheck, setLoginCheck] = React.useState(false);
	const [brand, setBrand] = React.useState("CMP-Lab@Messiah");
	const [basePath, setBasePath] = React.useState("/");
	const [fetchInfo, dispatchFetchInfo] = React.useReducer(
		fetchInfoReducer,
		async function (next) {
			preFetchInfo(
				setCourseTutor,
				setInfo,
				setShifts,
				next,
				showBoundary,
				userInfoId,
			);
		},
	);
	const { showBoundary } = useErrorBoundary();
	return (
		<AppContext.Provider
			value={{
				refNav,
				navbar,
				setNavbar,
				refBrand,
				navHeight,
				setNavHeight,
				fetchInfo,
				dispatchFetchInfo,
				courseTutor,
				shifts,
				info,
				setInfo,
				loginCheck,
				setLoginCheck,
				basePath,
				setBasePath,
				brand,
				setBrand,
			}}
		>
			{children}
		</AppContext.Provider>
	);
	function fetchInfoReducer(state, action) {
		switch (action.type) {
			case "set_id": {
				return async function (next) {
					preFetchInfo(
						setCourseTutor,
						setInfo,
						setShifts,
						next,
						showBoundary,
						action.payload,
					);
				};
			}
			default: {
				return state;
			}
		}
	}
};
