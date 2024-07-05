import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function StatusDisplay({ status, setStatus, reset }) {
	const [show, setShow] = useState(false);
	function handleClose() {
		if (status == "Check in successfully!") {
			reset();
		}
		setShow(false);
		setStatus();
	}
	useEffect(() => {
		if (status) {
			setShow(true);
		}
	}, [status]);
	return (
		<Modal
			show={show}
			onHide={handleClose}
			dialogClassName="modal-container"
		>
			<Modal.Header closeButton>
				<Modal.Title>Check In Status</Modal.Title>
			</Modal.Header>
			<Modal.Body>{status}</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
