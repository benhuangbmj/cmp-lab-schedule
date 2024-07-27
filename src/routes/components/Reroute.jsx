import React from "react";
import { useMatch } from "react-router-dom";
import { AppContext } from "/src/contexts/AppContext";
export default function () {
	const { basePath, setBasePath } = React.useContext(AppContext);
	const match = useMatch("/dept/:id/*");
	React.useEffect(() => {
		match && setBasePath(match.pathnameBase);
	}, []);
}
