import { useEffect, useState, useRef, useMemo } from "react";
import Video from "./classes/Video";

export default function ShootingWindow() {
	const [stream, setStream] = useState();
	const refVideo = useRef();
	const refCanvas = useRef();
	const video = useMemo(() => {
		if (stream) {
			return new Video(stream, refVideo.current);
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
	useEffect(() => {
		if (video) {
			video.projectTo(refCanvas.current);
			return () => {
				video.stop();
			};
		}
	}, [video]);
	return (
		<>
			<video
				ref={refVideo}
				muted
				autoPlay
				style={{
					position: "absolute",
					visibility: "hidden",
				}}
			/>
			<canvas ref={refCanvas} />
		</>
	);
}
