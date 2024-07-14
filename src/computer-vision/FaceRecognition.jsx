import { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
const MODEL_URL = "/models";
export default function FaceRecognition() {
	const refImg = useRef();
	useEffect(() => {
		(async () => {
			await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
			await faceapi.loadFaceLandmarkModel(MODEL_URL);
			await faceapi.loadFaceRecognitionModel(MODEL_URL);
			let fullFaceDescriptions = await faceapi
				.detectAllFaces(refImg.current)
				.withFaceLandmarks()
				.withFaceDescriptors();
			console.log(fullFaceDescriptions);
		})();
	});
	return (
		<>
			<img
				ref={refImg}
				src="/src/img/fad3f6dd54f446d08b7e95580def6541.jpeg"
			/>
		</>
	);
}
