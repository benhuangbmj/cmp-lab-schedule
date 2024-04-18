import Select from "react-select";
import { useSelector } from "react-redux";
import { selectUserData } from "/src/reducers/userDataReducer";
import { useState, useEffect } from "react";
import { apiBaseUrl } from "/src/utils";

export default function selectSupervisors({ user, currSupOptions }) {
	const userData = useSelector(selectUserData);
	const [supOptions, setSupOptions] = useState([]);
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
			const data = [];
			Object.keys(items).forEach((user) => {
				data.push({ value: user, label: items[user].name });
			});
			setSupOptions(data);
		}
	}, [userData]);
	return (
		<Select
			defaultValue={currSupOptions}
			options={supOptions}
			isMulti
			onChange={handleChange}
		/>
	);
}
