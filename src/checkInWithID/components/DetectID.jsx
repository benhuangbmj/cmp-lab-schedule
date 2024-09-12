import {
	studentFieldReadOnly as readOnly,
	studentFieldTypes as fieldTypes,
	studentFieldOptions as fieldOptions,
} from "/src/config.js";
import { useEffect, useState, useRef, useMemo, useContext } from "react";
import { useForm } from "react-hook-form";
import VideoStream from "/src/computer-vision/classes/VideoStream";
import ShootingWindow from "/src/computer-vision/ShootingWindow";
import CaptureImage from "/src/computer-vision/CaptureImage";
import TextDetection from "/src/computer-vision/TextDetection";
import InfoModal from "/src/util-components/InfoModal";
import FetchStudent from "/src/util-components/FetchStudent";
import updateDataById from "/src/controllers/updateDataById";
import StatusDisplay from "/src/checkInWithID/components/StatusDisplay";
import Button from "react-bootstrap/Button";
import { CVContext } from "/src/contexts/CVContext";

export default function CheckInWithID() {
	const [loaded, setLoaded] = useState(false);
	const [stream, setStream] = useState();
	const [streamCount, setStreamCount] = useState(0);
	const [id, setId] = useState();
	const [show, setShow] = useState(false);
	const [fieldNames, setFieldNames] = useState();
	const [student, setStudent] = useState();
	const [infoSubmitted, setInfoSubmitted] = useState(false);
	const [status, setStatus] = useState();
	const [streamStopped, setStreamStopped] = useState(false);
	const refCaptureImage = useRef();
	const refTextDetection = useRef();
	const formUtil = useForm({});
	const { dispatchActiveStreams } = useContext(CVContext);
	//create the video stream from the webcam
	const videoStream = useMemo(() => {
		if (stream) {
			setLoaded(true);
			return new VideoStream(stream);
		}
	}, [stream]);
	function reset() {
		setId();
		setStudent();
		setFieldNames();
		setShow(false);
		setInfoSubmitted(false);
		setStatus();
		setStreamCount(0);
		refCaptureImage.current.setCaptured(false);
		refTextDetection.current.reset();
	}
	function handleStreamControl() {
		if (streamStopped) {
			setStreamCount((state) => state + 1);
			setStreamStopped(false);
		} else {
			videoStream.stop();
			setStreamStopped(true);
		}
	}
	//Re-initialize the video stream
	useEffect(() => {
		setLoaded(false);
		VideoStream.createVideoStream(setStream);
	}, [streamCount]);
	//controller: student info display
	useEffect(() => {
		if (student) {
			formUtil.reset(student);
			setShow(true);
			setFieldNames(Object.keys(student));
		}
	}, [student]);
	//controller: student info update
	useEffect(() => {
		if (infoSubmitted) {
			let url;
			updateDataById({
				id: infoSubmitted.id,
				data: infoSubmitted,
				url,
			}).then((res) => setStatus(res));
			setInfoSubmitted(false);
		}
	}, [infoSubmitted]);
	useEffect(() => {
		if (videoStream) {
			dispatchActiveStreams({
				type: "set",
				payload: [videoStream],
			});
		}
	}, [videoStream]);
	const propsInfoModal = {
		show,
		setShow,
		formUtil,
		fieldNames,
		fieldTypes,
		fieldOptions,
		readOnly,
		setInfoSubmitted,
	};
	return (
		<>
			<div className="centered" style={{ margin: "0.25em auto" }}>
				<Button onClick={handleStreamControl}>
					{streamStopped ? "Resume" : "Stop"}
				</Button>
			</div>
			<div className="centered" style={{ margin: "0.25em auto" }}>
				Please scan your student ID
			</div>
			<div style={{ width: "fit-content", margin: "auto" }}>
				<ShootingWindow videoStream={videoStream} loaded={loaded} />
			</div>
			<CaptureImage
				ref={refCaptureImage}
				videoStream={videoStream}
				reset={reset}
				streamStopped={streamStopped}
			>
				<TextDetection id={id} setId={setId} ref={refTextDetection} />
			</CaptureImage>
			<InfoModal {...propsInfoModal} />
			<FetchStudent id={id} setStudent={setStudent} />
			<StatusDisplay
				status={status}
				setStatus={setStatus}
				reset={reset}
			/>
		</>
	);
}
