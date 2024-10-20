import { useEffect, useState, useRef, useMemo, useContext } from "react";
import { CVContext } from "/src/contexts/CVContext";
import FlipCamButton from "/src/computer-vision/FlipCamButton";
import Spinner from "react-bootstrap/Spinner";

export default function ShootingWindow({ loaded, videoStream }) {
	const cVContext = useContext(CVContext);
	const refVideo = useRef();
	const refCanvas = useRef();
	const video = cVContext?.labelStream || videoStream;

	useEffect(() => {
		if (video) {
			video.setVideo = refVideo.current;
			video.projectTo(refCanvas.current);
			return () => {
				video.stop();
				video.stopProjecting();
			};
		}
	}, [video]);
	return (
		<div
			style={{
				height: "100vw",
				maxHeight: "400px",
				marginBottom: "0.25em",
				position: "relative",
				width: "fit-content",
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
			<div style={{ position: "relative" }}>
				{!loaded && (
					<div
						style={{
							position: "absolute",
							display: "block",
							width: "100%",
							top: "50%",
						}}
					>
						<Spinner variant={video ? "light" : "dark"} />
					</div>
				)}
				<canvas ref={refCanvas} />
			</div>
			<FlipCamButton />
		</div>
	);
}
