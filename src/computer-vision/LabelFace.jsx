import { useState, useEffect } from "react";
import * as faceapi from "face-api.js";

export default function LabelFace({ labeledFaces, imgDataURL }) {
	const [labelText, setLabelText] = useState("");
	const addLabel = async () => {
		const fullFaceDescription = await faceapi
			.detectSingleFace(imgDataURL)
			.withFaceLandmarks()
			.withFaceDescriptor();
		if (!fullFaceDescription) {
			throw new Error("No face detected");
		}
		const faceDescriptors = [fullFaceDescription.descriptor];
		const newLabeledFace = new faceapi.LabeledFaceDescriptors(
			labelText,
			faceDescriptors,
		);
		labeledFaces.push(newLabeledFace);
	};
	return (
		<>
			<input
				value={labelText}
				onChange={(e) => {
					setLabelText(e.target.value);
				}}
			/>
			<button type="button" onClick={addLabel}>
				Add Labeled Face
			</button>
		</>
	);
}
