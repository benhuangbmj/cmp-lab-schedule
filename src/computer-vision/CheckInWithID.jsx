import { useEffect, useState, useRef, useMemo } from "react";
import VideoStream from "./classes/VideoStream";
import ShootingWindow from "./ShootingWindow";
import CaptureImage from "./CaptureImage";
import TextDetection from "./TextDetection";

export default function CheckInWithID() {
	const [stream, setStream] = useState();
	const [streamCount, setStreamCount] = useState(0);
	const [idNumber, setIdNumber] = useState();

	const videoStream = useMemo(() => {
		if (stream) {
			return new VideoStream(stream);
		}
	}, [stream]);

	//start the camera
	useEffect(() => {
		VideoStream.createVideoStream(setStream);
	}, [streamCount]);
	return (
		<div>
			<ShootingWindow videoStream={videoStream} />
			<CaptureImage videoStream={videoStream}>
				<TextDetection num={idNumber} setNum={setIdNumber} />
			</CaptureImage>
		</div>
	);
}
