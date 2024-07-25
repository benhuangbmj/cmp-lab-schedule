import React from "react";
export const AppContext = React.createContext(null);
import { useErrorBoundary } from "react-error-boundary";
import {
	fetchInfo as preFetchInfo,
	fetchKey,
	update3_0,
} from "/src/api-operations.js";

export const AppContextProvider = function ({ children }) {
	const refNav = React.useRef();
	const refBrand = React.useRef();
	const [navbar, setNavbar] = React.useState(true);
	const [navHeight, setNavHeight] = React.useState();
	const [info, setInfo] = React.useState(null);
	const [courseTutor, setCourseTutor] = React.useState(null);
	const [shifts, setShifts] = React.useState(null);
	const { showBoundary } = useErrorBoundary();
	const fetchInfo = React.useCallback(
		async (next) =>
			preFetchInfo(
				setCourseTutor,
				setInfo,
				setShifts,
				next,
				showBoundary,
			),
		[],
	);
	React.useEffect(() => {
		if (!info) {
			fetchInfo();
		}
	}, []);
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
				courseTutor,
				shifts,
				info,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
