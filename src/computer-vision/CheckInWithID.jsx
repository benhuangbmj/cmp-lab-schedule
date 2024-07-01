import { useEffect, useState, useRef, useMemo } from "react";
import VideoStream from "./classes/VideoStream";
import ShootingWindow from "./ShootingWindow";
import CaptureImage from "./CaptureImage";

export default function CheckInWithID() {
	const [stream, setStream] = useState();
	const videoStream = useMemo(() => {
		if (stream) {
			return new VideoStream(stream);
		}
	}, [stream]);

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
	}, []);
	return (
		<div>
			<ShootingWindow videoStream={videoStream} />
			<CaptureImage videoStream={videoStream} />
		</div>
	);
}
