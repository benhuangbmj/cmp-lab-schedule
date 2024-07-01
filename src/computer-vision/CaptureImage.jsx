import { useState, cloneElement, Children } from "react";
import Button from "react-bootstrap/Button";

export default function CaptureImage({ videoStream, children }) {
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
			{Children.map(children, (child, i) => {
				return cloneElement(child, {
					imgDataURL: imgDataURL,
					key: i,
				});
			})}
		</div>
	);
}
