import React from "react";
import { useMatch, useParams } from "react-router-dom";
import { AppContext } from "/src/contexts/AppContext";
import contentfulApi from "/src/api-operations";
export default function () {
	const appContext = React.useContext(AppContext);
	const { id } = useParams();
	const match = useMatch("/dept/:id/*");
	React.useLayoutEffect(() => {
		match && appContext.setBasePath(match.pathnameBase);
		handleDeptInfo();
	}, []);

	async function handleDeptInfo() {
		if (id) {
			const deptInfo = await contentfulApi.fetchDeptInfoById(id);
			appContext.setBrand(deptInfo.brand);
			appContext.dispatchFetchInfo({
				type: "set_id",
				payload: deptInfo.tutorInfo,
			});
			appContext.setInfo(null);
		}
	}
}
