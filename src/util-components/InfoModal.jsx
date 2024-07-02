import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import FormField from "./FormField";
export default function InfoModal({
	formUtil,
	show,
	setShow,
	fieldNames,
	fieldTypes,
	formOptions = {},
	fieldOptions = {},
	readOnly = {},
}) {
	function handleClose() {
		setShow(false);
	}
	function onSubmit(data) {
		setShow(false);
		console.log(data);
	}
	return (
		<Modal
			show={show}
			onHide={handleClose}
			backdrop="static"
			dialogClassName="modal-container"
			keyboard={false}
		>
			<Modal.Header closeButton>
				<Modal.Title>Student Info</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<form>
					{fieldNames &&
						fieldNames.map((field) => (
							<FormField
								key={field}
								fieldName={field}
								formUtil={formUtil}
								fieldType={fieldTypes[field]}
								formOptions={formOptions[field]}
								fieldOptions={fieldOptions[field]}
								readOnly={readOnly[field]}
							/>
						))}
				</form>
			</Modal.Body>
			<Modal.Footer>
				<Button type="button" onClick={formUtil.handleSubmit(onSubmit)}>
					Confirm
				</Button>
				<Button variant="secondary" onClick={handleClose}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
