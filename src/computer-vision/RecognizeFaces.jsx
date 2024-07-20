import { useEffect, useState, useContext, useCallback, useRef } from "react";
import { CVContext } from "/src/contexts/CVContext";
import Button from "react-bootstrap/Button";

export default function RecognizeFaces() {
	const cVContext = useContext(CVContext);
	const { faceapi, labeledFaces, recognizeStream, dispatchRecognizeStream } =
		cVContext;
	const refVideo = useRef();
	const refVideoCanvas = useRef();
	const refContainer = useRef();
	const [dimensions, setDimensions] = useState([0, 0]);
	const [intervalDraw, setIntervalDraw] = useState();
	const [recognizing, setRecognizing] = useState(false);
	var processFaceRecognition = useCallback(
		async function () {
			if (intervalDraw) {
				clearInterval(intervalDraw);
			}
			const ctx = refVideoCanvas.current.getContext("2d");
			async function draw() {
				const fullFaceDescriptions = await faceapi
					.detectAllFaces(refVideo.current)
					.withFaceLandmarks()
					.withFaceDescriptors();
				const maxDescriptorDistance = 0.6;
				const faceMatcher = new faceapi.FaceMatcher(
					labeledFaces,
					maxDescriptorDistance,
				);

				const results = fullFaceDescriptions.map((fd) =>
					faceMatcher.findBestMatch(fd.descriptor),
				);
				ctx.reset();
				if (refVideoCanvas.current) {
					results.forEach((bestMatch, i) => {
						const box = fullFaceDescriptions[i].detection.box;
						const text = bestMatch.toString();
						const drawBox = new faceapi.draw.DrawBox(box, {
							label: text,
						});
						drawBox.draw(refVideoCanvas.current);
					});
				}
			}
			const interval = setInterval(() => {
				draw();
			}, 100);
			setIntervalDraw(interval);
		},
		[labeledFaces],
	);
	useEffect(() => {
		if (recognizing) {
			processFaceRecognition();
		} else if (intervalDraw) {
			clearInterval(intervalDraw);
			setTimeout(() => {
				refVideoCanvas.current.getContext("2d").reset();
			}, 1000);
		}
	}, [recognizing, processFaceRecognition]);
	useEffect(() => {
		return () => {
			if (intervalDraw) {
				clearInterval(intervalDraw);
			}
		};
	}, [intervalDraw]);
	useEffect(() => {
		if (recognizeStream) recognizeStream.setVideo = refVideo.current;
	}, [recognizeStream]);

	return (
		<>
			<Button
				type="button"
				onClick={handleFaceRecognition}
				disabled={labeledFaces.length == 0}
			>
				{recognizing ? "Stop" : "Recognize Faces"}
			</Button>
			<div
				ref={refContainer}
				style={{
					boxSizing: "border-box",
					width: dimensions[0],
					height: dimensions[1],
					margin: "auto",
					maxWidth: "100vw",
					overflowX: "hidden",
					position: "relative",
				}}
			>
				<div>
					<video
						ref={refVideo}
						autoPlay
						style={{ position: "absolute", display: "block" }}
						onResize={() => {
							setDimensions([
								refVideo.current.videoWidth,
								refVideo.current.videoHeight,
							]);
						}}
					/>
					<canvas
						ref={refVideoCanvas}
						style={{ position: "absolute", display: "block" }}
						width={dimensions[0]}
						height={dimensions[1]}
					/>
				</div>
			</div>
		</>
	);
	function handleFaceRecognition() {
		setRecognizing((state) => !state);
	}
}
