import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { labels } from "/src/mockData";
import VideoStream from "/src/computer-vision/classes/VideoStream";
const MODEL_URL = "/models";
export default function FaceRecognition() {
	const refVideo = useRef();
	const refVideoCanvas = useRef();
	const [loaded, setLoaded] = useState(false);
	useEffect(() => {
		VideoStream.createVideoStream((stream) => {
			refVideo.current.srcObject = stream;
		});
	}, []);

	useEffect(() => {
		if (loaded) {
			(async () => {
				const ctx = refVideoCanvas.current.getContext("2d");
				await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
				await faceapi.loadFaceLandmarkModel(MODEL_URL);
				await faceapi.loadFaceRecognitionModel(MODEL_URL);
				const labeledFaceDescriptors = await Promise.all(
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

						const faceDescriptors = [
							fullFaceDescription.descriptor,
						];
						return new faceapi.LabeledFaceDescriptors(
							label,
							faceDescriptors,
						);
					}),
				);
				async function draw() {
					let fullFaceDescriptions = await faceapi
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
				setInterval(() => {
					draw();
				}, 100);
			})();
		}
	}, [loaded]);
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
						setLoaded(true);
					}}
				/>
				<canvas
					ref={refVideoCanvas}
					style={{ position: "absolute", display: "block" }}
				/>
			</div>
		</>
	);
}
