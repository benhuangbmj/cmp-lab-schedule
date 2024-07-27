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
		handleBrand();
	}, []);

	async function handleBrand() {
		if (id) {
			const brand = await contentfulApi.fetchBrand(id);
			appContext.setBrand(brand);
		}
	}
}
