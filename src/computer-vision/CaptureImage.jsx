import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import TextDetection from "./TextDetection";

export default function CaptureImage({ videoStream }) {
	const [captured, setCaptured] = useState(false);
	const [imgDataURL, setImgDataURL] = useState();
	function handleCapture() {
		if (!captured) {
			const dataURL = videoStream.captureImage();
			if (dataURL) {
				setImgDataURL(dataURL);
				setCaptured(true);
			}
		} else {
			videoStream.restartProjecting();
			setCaptured(false);
		}
	}
	return (
		<div>
			<Button type="button" onClick={handleCapture}>
				{captured ? "Retake" : "Capture ID"}
			</Button>
			<TextDetection imgDataURL={imgDataURL} />
		</div>
	);
}
