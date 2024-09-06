import React from "react";
export const AppContext = React.createContext(null);
import { useErrorBoundary } from "react-error-boundary";
import {
	fetchInfo as preFetchInfo,
	update3_0 as preUpdate,
	update2_0 as preUpdateWithoutFetch,
	fetchKey as preFetchKey,
	Contentful,
} from "/src/api-operations.js";
export const AppContextProvider = function ({ children }) {
	const { showBoundary } = useErrorBoundary();
	const refNav = React.useRef();
	const refBrand = React.useRef();
	const [navHeight, setNavHeight] = React.useState();
	const [info, setInfo] = React.useState(null);
	const [courseTutor, setCourseTutor] = React.useState(null);
	const [shifts, setShifts] = React.useState(null);
	const [loginCheck, setLoginCheck] = React.useState(false);
	const [brand, setBrand] = React.useState("CMP-Lab@Messiah");
	const [basePath, setBasePath] = React.useState();
	const [fetchInfo, dispatchFetchInfo] = React.useReducer(
		fetchInfoReducer,
		async function (next = () => {}) {
			preFetchInfo(
				setCourseTutor,
				setInfo,
				setShifts,
				next,
				showBoundary,
			);
		},
	);
	const [update, dispatchUpdate] = React.useReducer(updateReducer, preUpdate);
	const [updateWithoutFetch, dispatchUpdateWithoutFetch] = React.useReducer(
		updateReducer,
		preUpdateWithoutFetch,
	);
	const [fetchKey, dispatchFetchKey] = React.useReducer(
		fetchKeyReducer,
		preFetchInfo,
	);
	const [contentfulApi, dispatchContentfulApi] = React.useReducer(
		contentfulApiReducer,
		new Contentful(),
	);

	return (
		<AppContext.Provider
			value={{
				refNav,
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
				update,
				dispatchUpdate,
				updateWithoutFetch,
				dispatchUpdateWithoutFetch,
				fetchKey,
				dispatchFetchKey,
				contentfulApi,
				dispatchContentfulApi,
			}}
		>
			{children}
		</AppContext.Provider>
	);
	function fetchInfoReducer(state, action) {
		switch (action.type) {
			case "set_id": {
				return async function (next = () => {}) {
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
	function updateReducer(state, action) {
		switch (action.type) {
			case "set_id": {
				return async function ({
					targetKey,
					keys,
					value,
					fetchInfo,
					next = () => {},
				}) {
					return await preUpdate({
						targetKey,
						keys,
						value,
						fetchInfo,
						next,
						entryId: action.payload,
					});
				};
			}
			case "set_id_without_fetch": {
				return async function (targetKey, keys, value) {
					return await preUpdateWithoutFetch(
						targetKey,
						keys,
						value,
						action.payload,
					);
				};
			}
			case "set_fetchInfo": {
				const fetchInfoAlias = fetchInfo;
				return async function ({
					targetKey,
					keys,
					value,
					fetchInfo = fetchInfoAlias,
					next = () => {},
				}) {
					return await state({
						targetKey,
						keys,
						value,
						fetchInfo,
						next,
					});
				};
			}
			default: {
				return state;
			}
		}
	}
	function fetchKeyReducer(state, action) {
		switch (action.type) {
			case "set_id": {
				return async function (user, key) {
					return await preFetchKey(user, key, action.payload);
				};
			}
		}
	}
	function contentfulApiReducer(state, action) {
		switch (action.type) {
			case "set_id": {
				return new Contentful(action.payload);
			}
			default: {
				return state;
			}
		}
	}
};
