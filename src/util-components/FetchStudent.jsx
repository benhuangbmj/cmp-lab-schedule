import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";

function fetchData(id) {
	return new Promise((res, rej) => {
		setTimeout(() => {
			if (id == "01279776") {
				res({
					id: "01279776",
					name: "Ben Huang",
					major: "Mathematics",
					email: "bhuang@messiah.edu",
					subject: "Calculus III",
					year: "Senior",
				});
			} else {
				res({
					id: id,
					name: "",
					major: "",
					email: "",
					subject: "",
					year: "",
				});
			}
		}, 0);
	});
}
export default function FetchStudent({ id, setStudent }) {
	const [confirmed, setConfirmed] = useState(false);
	function handleConfirm() {
		setConfirmed(true);
	}
	useEffect(() => {
		if (confirmed) {
			fetchData(id).then((data) => {
				setStudent(data);
			});
			setConfirmed(false);
		}
	}, [confirmed]);
	return (
		<div>
			<Button disabled={!/\d{8,8}/.test(id)} onClick={handleConfirm}>
				Confirm ID
			</Button>
		</div>
	);
}
