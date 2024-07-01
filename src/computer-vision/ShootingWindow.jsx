import { useEffect, useState, useRef, useMemo } from "react";

export default function ShootingWindow({ videoStream }) {
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
		<div>
			<canvas ref={refCanvas} />
			<video
				ref={refVideo}
				muted
				autoPlay
				style={{
					position: "absolute",
					visibility: "hidden",
				}}
			/>
		</div>
	);
}
