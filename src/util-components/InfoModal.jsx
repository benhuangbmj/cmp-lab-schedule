import { useState, useRef, useEffect } from "react";
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
	setInfoSubmitted,
}) {
	const {
		formState: { isDirty },
	} = formUtil;
	function handleClose() {
		setShow(false);
	}
	function onSubmit(data) {
		setShow(false);
		setInfoSubmitted(data);
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
					{isDirty ? "Update" : "Confirm"}
				</Button>
				<Button variant="secondary" onClick={handleClose}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
