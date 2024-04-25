import Select from "react-select";
import { useSelector } from "react-redux";
import { selectUserData } from "/src/reducers/userDataReducer";
import { useState, useEffect } from "react";
import { apiBaseUrl } from "/src/utils";

export default function selectSupervisors({ user, currSupOptions = [] }) {
	const userData = useSelector(selectUserData);
	const [supOptions, setSupOptions] = useState([]);
	const [defaultOptions, setDefaultOptions] = useState([]);
	function handleChange(values) {
		const data = { user: user, supervisors: values };
		fetch(apiBaseUrl + "/set-supervisors", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});
	}
	useEffect(() => {
		if (userData && userData.status == "succeeded") {
			const items = userData.items;
			const options = [];
			const defaultValue = [];
			Object.keys(items).forEach((user) => {
				const curr = { value: user, label: items[user].name };
				options.push(curr);
				if (currSupOptions.includes(user)) defaultValue.push(curr);
			});
			setSupOptions(options);
			setDefaultOptions(defaultValue);
		}
	}, [userData]);
	return (
		supOptions.length > 0 && (
			<Select
				defaultValue={defaultOptions}
				options={supOptions}
				isMulti
				onChange={handleChange}
			/>
		)
	);
}
