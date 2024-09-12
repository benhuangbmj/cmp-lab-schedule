import * as React from "react";
import { AppContext } from "/src/contexts/AppContext";
import utils from "/src/utils";

export default function useCheckOffline() {
	const { setOffline } = React.useContext(AppContext);
	React.useEffect(() => {
		fetch(utils.apiBaseUrl + "/about").catch((err) => {
			console.warn(err);
			setOffline(true);
		});
	}, []);
}
