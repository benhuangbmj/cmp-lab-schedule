import { useEffect, useState, useRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import VideoStream from "./classes/VideoStream";
import ShootingWindow from "./ShootingWindow";
import CaptureImage from "./CaptureImage";
import TextDetection from "./TextDetection";
import InfoModal from "/src/util-components/InfoModal";
import FetchStudent from "/src/util-components/FetchStudent";

const readOnly = {
	id: true,
};
const fieldTypes = {
	id: "text",
	name: "text",
	major: "text",
	email: "email",
	subject: "select",
	year: "select",
};

const fieldOptions = {
	subject: ["Calculus III", "Mathematics", "Physics"],
	year: ["Freshman", "Sophomore", "Junior", "Senior"],
};
let values;

export default function CheckInWithID() {
	const [stream, setStream] = useState();
	const [streamCount, setStreamCount] = useState(0);
	const [id, setId] = useState();
	const [show, setShow] = useState(false);
	const [fieldNames, setFieldNames] = useState();
	const [student, setStudent] = useState();
	const formUtil = useForm({
		values,
	});
	const videoStream = useMemo(() => {
		if (stream) {
			return new VideoStream(stream);
		}
	}, [stream]);

	useEffect(() => {
		VideoStream.createVideoStream(setStream);
	}, [streamCount]);

	useEffect(() => {
		if (student) {
			formUtil.reset(student);
			setShow(true);
			setFieldNames(Object.keys(student));
		}
	}, [student]);

	return (
		<main>
			<div className="centered">Please scan your student ID</div>

			<ShootingWindow videoStream={videoStream} />
			<CaptureImage videoStream={videoStream}>
				<TextDetection id={id} setId={setId} />
			</CaptureImage>
			<InfoModal
				show={show}
				setShow={setShow}
				formUtil={formUtil}
				fieldNames={fieldNames}
				fieldTypes={fieldTypes}
				fieldOptions={fieldOptions}
				readOnly={readOnly}
			/>
			<FetchStudent id={id} setStudent={setStudent} />
		</main>
	);
}
