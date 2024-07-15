import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
const MODEL_URL = "/models";
import { labels } from "/src/mockData";
export default function FaceRecognition() {
	const refImg = useRef();
	const refCanvas = useRef();
	const [loaded, setLoaded] = useState(false);
	useEffect(() => {
		if (loaded) {
			(async () => {
				await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
				await faceapi.loadFaceLandmarkModel(MODEL_URL);
				await faceapi.loadFaceRecognitionModel(MODEL_URL);
				const labeledFaceDescriptors = await Promise.all(
					labels.map(async (label) => {
						// fetch image data from urls and convert blob to HTMLImage element
						const imgUrl = `/src/img/${label}.jpg`;
						const img = await faceapi.fetchImage(imgUrl);

						// detect the face with the highest score in the image and compute it's landmarks and face descriptor
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
				let fullFaceDescriptions = await faceapi
					.detectAllFaces(refImg.current)
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
				faceapi.draw.drawDetections(
					refCanvas.current,
					fullFaceDescriptions,
				);
				faceapi.draw.drawFaceLandmarks(
					refCanvas.current,
					fullFaceDescriptions,
				);
				results.forEach((bestMatch, i) => {
					const box = fullFaceDescriptions[i].detection.box;
					const text = bestMatch.toString();
					const drawBox = new faceapi.draw.DrawBox(box, {
						label: text,
					});
					drawBox.draw(refCanvas.current);
				});
			})();
		}
	});
	return (
		<div>
			<img
				ref={refImg}
				src="/src/img/1fc0cfd0513c4330b566d994374f607a.jpeg"
				style={{ position: "absolute", display: "block" }}
				onLoad={() => setLoaded(true)}
			/>
			{loaded && (
				<canvas
					className="designing"
					ref={refCanvas}
					width={refImg.current?.width}
					height={refImg.current?.height}
					style={{ position: "absolute", display: "block" }}
				/>
			)}
		</div>
	);
}
