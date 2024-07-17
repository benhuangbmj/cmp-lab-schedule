import {
	useState,
	cloneElement,
	Children,
	forwardRef,
	useImperativeHandle,
	useEffect,
} from "react";
import Button from "react-bootstrap/Button";

const CaptureImage = forwardRef(function CaptureImage(
	{
		videoStream,
		children,
		reset,
		streamStopped,
		toDataURL = true,
		triggerText = "Capture ID",
	},
	ref,
) {
	const [captured, setCaptured] = useState(false);
	const [imgDataURL, setImgDataURL] = useState();
	function handleCapture() {
		if (!captured) {
			const dataURL = videoStream.captureImage(toDataURL);
			if (dataURL) {
				setImgDataURL(dataURL);
				setCaptured(true);
			}
		} else {
			if (reset) {
				reset();
			}
			setCaptured(false);
		}
	}
	useImperativeHandle(
		ref,
		() => ({
			setCaptured,
		}),
		[],
	);
	useEffect(() => {
		if (!captured && videoStream) {
			videoStream.restartProjecting();
		}
	}, [captured]);

	return (
		<div>
			<Button
				disabled={streamStopped}
				type="button"
				onClick={handleCapture}
			>
				{captured ? "Retake" : triggerText}
			</Button>
			{Children.map(children, (child, i) => {
				return cloneElement(child, {
					imgDataURL: imgDataURL,
					key: i,
				});
			})}
		</div>
	);
});

export default CaptureImage;
