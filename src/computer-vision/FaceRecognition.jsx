import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
const MODEL_URL = "/models";
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
				let fullFaceDescriptions = await faceapi
					.detectAllFaces(refImg.current)
					.withFaceLandmarks()
					.withFaceDescriptors();
				faceapi.draw.drawDetections(
					refCanvas.current,
					fullFaceDescriptions,
				);
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
