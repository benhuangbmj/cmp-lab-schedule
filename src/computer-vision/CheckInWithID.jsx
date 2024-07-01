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

	//start the camera stream
	useEffect(() => {
		(async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					audio: false,
					video: {
						facingMode: "environment",
					},
				});
				setStream(stream);
			} catch (err) {
				console.error(err);
			}
		})();
	}, [streamCount]);
	return (
		<div>
			<ShootingWindow videoStream={videoStream} />
			<CaptureImage videoStream={videoStream}>
				<TextDetection setIdNumber={setIdNumber} />
			</CaptureImage>
		</div>
	);
}
