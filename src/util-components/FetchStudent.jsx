import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import fetchDataById from "/src/controllers/fetchDataById";

export default function FetchStudent({ id, setStudent }) {
	const [confirmed, setConfirmed] = useState(false);
	const url = null;
	function handleConfirm() {
		setConfirmed(true);
	}
	useEffect(() => {
		if (confirmed) {
			fetchDataById({ id, url }).then((data) => {
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
