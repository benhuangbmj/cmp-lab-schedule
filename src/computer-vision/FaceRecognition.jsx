import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { labels } from "/src/mockData";
import VideoStream from "/src/computer-vision/classes/VideoStream";
const MODEL_URL = "/models";
export default function FaceRecognition() {
	const refVideo = useRef();
	const refVideoCanvas = useRef();
	const [loaded, setLoaded] = useState(false);
	const [labeledFaceDescriptors, setLabeledFaceDescriptors] = useState();
	const videoStream = useRef();
	useEffect(() => {
		prepare();
		return () => {
			videoStream.current?.stop();
		};
	}, []);

	useEffect(() => {
		let intervalDraw;
		if (loaded && labeledFaceDescriptors) {
			(async () => {
				const ctx = refVideoCanvas.current.getContext("2d");
				async function draw() {
					const fullFaceDescriptions = await faceapi
						.detectAllFaces(refVideo.current)
						.withFaceLandmarks()
						.withFaceDescriptors();
					const maxDescriptorDistance = 0.6;
					const faceMatcher = new faceapi.FaceMatcher(
						labeledFaceDescriptors,
						maxDescriptorDistance,
					);

					const results = fullFaceDescriptions.map((fd) =>
						faceMatcher.findBestMatch(fd.descriptor),
					);
					ctx.reset();
					if (refVideoCanvas.current) {
						faceapi.draw.drawFaceLandmarks(
							refVideoCanvas.current,
							fullFaceDescriptions,
						);
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
				intervalDraw = setInterval(() => {
					draw();
				}, 100);
			})();
		}
		return () => {
			if (intervalDraw) {
				clearInterval(intervalDraw);
			}
		};
	}, [loaded, labeledFaceDescriptors]);
	useEffect(() => {
		VideoStream.createVideoStream((stream) => {
			videoStream.current = new VideoStream(stream, refVideo.current);
		});
	}, []);
	return (
		<>
			<div style={{ width: "100%", height: "100vw" }}>
				<video
					ref={refVideo}
					autoPlay
					style={{ position: "absolute", display: "block" }}
					onResize={() => {
						refVideoCanvas.current.width =
							refVideo.current.videoWidth;
						refVideoCanvas.current.height =
							refVideo.current.videoHeight;
					}}
				/>
				<canvas
					ref={refVideoCanvas}
					style={{ position: "absolute", display: "block" }}
				/>
				<button
					type="button"
					style={{ position: "absolute", display: "block" }}
					onClick={() => {
						videoStream.current?.switch();
					}}
				>
					Flip
				</button>
			</div>
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
			});
		});
	}
}
