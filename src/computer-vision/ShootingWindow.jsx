import { useEffect, useState, useRef, useMemo } from "react";
import Spinner from "react-bootstrap/Spinner";

export default function ShootingWindow({ loaded, videoStream }) {
	const refVideo = useRef();
	const refCanvas = useRef();
	const video = videoStream;

	useEffect(() => {
		if (video) {
			video.setVideo = refVideo.current;
			video.projectTo(refCanvas.current);
			return () => {
				video.stop();
				video.stopProjecting();
			};
		}
	}, [videoStream]);
	return (
		<div
			style={{
				height: "100vw",
				maxHeight: "400px",
				marginBottom: ".25em",
			}}
		>
			<video
				ref={refVideo}
				muted
				autoPlay
				style={{
					position: "absolute",
					visibility: "hidden",
					wdith: 0,
					height: 0,
				}}
			/>
			<div>
				{!loaded && (
					<div
						style={{
							position: "absolute",
							display: "block",
							width: "100%",
							paddingTop: "min(190px, 45vw)",
						}}
					>
						<Spinner variant={videoStream ? "light" : "dark"} />
					</div>
				)}
				<canvas ref={refCanvas} />
			</div>
		</div>
	);
}
