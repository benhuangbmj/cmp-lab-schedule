import { useEffect, useState, useRef, useMemo } from "react";

export default function ShootingWindow({ videoStream }) {
	console.log(videoStream);
	const refVideo = useRef();
	const refCanvas = useRef();
	const video = videoStream;

	useEffect(() => {
		if (videoStream) {
			video.setVideo = refVideo.current;
			video.projectTo(refCanvas.current);
			return () => {
				video.stop();
				video.stopProjecting();
			};
		}
	}, [videoStream]);
	return (
		<>
			<canvas ref={refCanvas} />
			<button type="button" onClick={() => video.stopProjecting()}>
				Stop
			</button>
			<button
				type="button"
				onClick={() => {
					video.projectTo(refCanvas.current);
				}}
			>
				{" "}
				Start{" "}
			</button>
			<video
				ref={refVideo}
				muted
				autoPlay
				style={{
					position: "absoluate",
					visibility: "hidden",
				}}
			/>
		</>
	);
}
