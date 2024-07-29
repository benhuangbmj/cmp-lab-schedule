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
	const [basePath, setBasePath] = React.useState();
	const [fetchInfo, dispatchFetchInfo] = React.useReducer(
		fetchInfoReducer,
		null,
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
