import { useEffect, useRef, useState, useCallback, useContext } from "react";
import * as faceapi from "face-api.js";
import { labels } from "/src/mockData";
import VideoStream from "/src/computer-vision/classes/VideoStream";
import ShootingWindow from "/src/computer-vision/ShootingWindow";
import CaptureImage from "/src/computer-vision/CaptureImage";
import LabelFace from "/src/computer-vision/LabelFace";
import ImageGallery from "/src/util-components/ImageGallery";
import SingleFace from "/src/computer-vision/SingleFace";
import { CVContext } from "/src/contexts/CVContext";
import Button from "react-bootstrap/Button";
const MODEL_URL = "/models";
export default function FaceRecognition() {
	const cVContext = useContext(CVContext);
	const refVideo = useRef();
	const refVideoCanvas = useRef();
	const [loaded, setLoaded] = useState(false);
	const { recognizeStream, dispatchRecognizeStream } = cVContext;
	const { labelStream, dispatchLabelStream } = cVContext;
	const { faceCollection } = cVContext;
	const refContainer = useRef();
	const refLabelFace = useRef();
	const refCaptureImage = useRef();
	const { labeledFaces, dispatchLabeledFaces } = cVContext;
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
		VideoStream.createVideoStream((stream) => {
			dispatchRecognizeStream({
				type: "set",
				payload: new VideoStream(stream, refVideo.current),
			});
			dispatchLabelStream({
				type: "set",
				payload: new VideoStream(stream),
			});
		});
		prepare();
	}, []);

	useEffect(() => {
		return () => {
			if (intervalDraw) {
				clearInterval(intervalDraw);
			}
		};
	}, [intervalDraw]);

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
			recognizeStream?.stop();
			labelStream?.stop();
		};
	}, [recognizeStream, labelStream]);
	return (
		<>
			<ImageGallery
				collection={faceCollection}
				captions={labeledFaces.map((e) => e.label)}
			/>
			<div
				className="flexbox-row"
				style={{ justifyContent: "center", gap: "1em 2em" }}
			>
				<div>
					<ShootingWindow loaded={loaded} />
				</div>
				<SingleFace
					src={refLabelFace.current?.imgSrc}
					errorMessage={refLabelFace.current?.errorMessage}
				/>
			</div>
			<CaptureImage
				ref={refCaptureImage}
				videoStream={labelStream}
				streamStopped={false}
				toDataURL={false}
				triggerText="Capture Face"
				reset={refLabelFace.current?.reset}
			>
				<LabelFace
					ref={refLabelFace}
					setCaptured={refCaptureImage.current?.setCaptured}
				/>
			</CaptureImage>
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
					<Button
						type="button"
						style={{ position: "absolute", display: "block" }}
						onClick={() => {
							recognizeStream?.switch();
							labelStream?.switch();
						}}
					>
						Flip
					</Button>
				</div>
			</div>
		</>
	);
	function prepare() {
		Promise.all([
			faceapi.loadSsdMobilenetv1Model(MODEL_URL),
			faceapi.loadFaceLandmarkModel(MODEL_URL),
			faceapi.loadFaceRecognitionModel(MODEL_URL),
		]).then(() => {
			setLoaded(true);
		});
	}

	function handleFaceRecognition() {
		setRecognizing((state) => !state);
	}
}
