import { createContext, useReducer, useRef, useState, useEffect } from "react";
export const AppContext = createContext(null);

export const AppContextProvider = function ({ children }) {
	const refNav = useRef();
	const refBrand = useRef();
	const [navbar, setNavbar] = useState(true);
	return (
		<AppContext.Provider
			value={{
				refNav,
				navbar,
				setNavbar,
				refBrand,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
