import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { labels } from "/src/mockData";
import VideoStream from "/src/computer-vision/classes/VideoStream";
import ShootingWindow from "/src/computer-vision/ShootingWindow";
import CaptureImage from "/src/computer-vision/CaptureImage";
import LabelFace from "/src/computer-vision/LabelFace";
const MODEL_URL = "/models";
export default function FaceRecognition() {
	const refVideo = useRef();
	const refVideoCanvas = useRef();
	const [loaded, setLoaded] = useState(false);
	const [labeledFaceDescriptors, setLabeledFaceDescriptors] = useState();
	const videoStream = useRef();
	const labelStream = useRef();
	const refContainer = useRef();
	const refCaptureImage = useRef();
	const refLabeledFaces = useRef([]);
	const [dimensions, setDimensions] = useState([0, 0]);
	const [intervalDraw, setIntervalDraw] = useState();
	useEffect(() => {
		VideoStream.createVideoStream((stream) => {
			videoStream.current = new VideoStream(stream, refVideo.current);
			labelStream.current = new VideoStream(stream);
		});
		prepare();
		return () => {
			videoStream.current?.stop();
			labelStream.current?.stop();
		};
	}, []);

	useEffect(() => {
		return () => {
			if (intervalDraw) {
				clearInterval(intervalDraw);
			}
		};
	}, [intervalDraw]);
	return (
		<>
			<button type="button" onClick={handleFaceRecognition}>
				Face Recognition
			</button>
			<div
				ref={refContainer}
				className="designing"
				style={{
					width: dimensions[0],
					height: dimensions[1],
					margin: "auto",
				}}
			>
				<div>
					<video
						className="designing"
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
						className="designing"
						ref={refVideoCanvas}
						style={{ position: "absolute", display: "block" }}
						width={dimensions[0]}
						height={dimensions[1]}
					/>
					<button
						type="button"
						style={{ position: "absolute", display: "block" }}
						onClick={() => {
							videoStream.current?.switch();
							labelStream.current?.switch();
						}}
					>
						Flip
					</button>
				</div>
			</div>
			<ShootingWindow videoStream={labelStream.current} loaded={loaded} />
			<CaptureImage
				videoStream={labelStream.current}
				streamStopped={false}
				toDataURL={false}
				triggerText="Capture Face"
			>
				<LabelFace labeledFaces={refLabeledFaces.current} />
			</CaptureImage>
		</>
	);
	function prepare() {
		Promise.all([
			VideoStream.createVideoStream((stream) => {
				videoStream.current = new VideoStream(stream, refVideo.current);
			}),
			faceapi.loadSsdMobilenetv1Model(MODEL_URL),
			faceapi.loadFaceLandmarkModel(MODEL_URL),
			faceapi.loadFaceRecognitionModel(MODEL_URL),
		]).then(() => {
			/*
			Promise.all(
				labels.map(async (label) => {
					const imgUrl = `/src/img/${label}.jpg`;
					const img = await faceapi.fetchImage(imgUrl);
					const fullFaceDescription = await faceapi
						.detectSingleFace(img)
						.withFaceLandmarks()
						.withFaceDescriptor();

					if (!fullFaceDescription) {
						throw new Error(`no faces detected for ${label}`);
					}

					const faceDescriptors = [fullFaceDescription.descriptor];
					return new faceapi.LabeledFaceDescriptors(
						label,
						faceDescriptors,
					);
				}),
			).then((labeledFaceDescriptors) => {
				setLabeledFaceDescriptors(labeledFaceDescriptors);
				setLoaded(true);
			});*/
			setLoaded(true);
		});
	}
	async function handleFaceRecognition() {
		const ctx = refVideoCanvas.current.getContext("2d");
		async function draw() {
			const fullFaceDescriptions = await faceapi
				.detectAllFaces(refVideo.current)
				.withFaceLandmarks()
				.withFaceDescriptors();
			const maxDescriptorDistance = 0.6;
			const faceMatcher = new faceapi.FaceMatcher(
				//labeledFaceDescriptors,
				refLabeledFaces.current,
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
	}
}
