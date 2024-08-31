import React from "react";
import { useMatch, useParams } from "react-router-dom";
import { AppContext } from "/src/contexts/AppContext";
import contentfulApi from "/src/api-operations";
export default function () {
	const appContext = React.useContext(AppContext);
	const { id } = useParams();
	const match = useMatch("/dept/:id/*");
	React.useLayoutEffect(() => {
		match
			? appContext.setBasePath(match.pathnameBase)
			: appContext.setBasePath("/");
		handleDeptInfo();
	}, []);

	async function handleDeptInfo() {
		if (id) {
			const toDispatch = [
				"FetchInfo",
				"Update",
				"FetchKey",
				"ContentfulApi",
			];
			const deptInfo = await contentfulApi.fetchDeptInfoById(id);
			appContext.setBrand(deptInfo.brand);
			toDispatch.forEach((operator) => {
				appContext["dispatch" + operator]({
					type: "set_id",
					payload: deptInfo.tutorInfo,
				});
			});
			appContext.dispatchUpdateWithoutFetch({
				type: "set_id_without_fetch",
				payload: deptInfo.tutorInfo,
			});
			appContext.setInfo(null);
		}
	}
}
