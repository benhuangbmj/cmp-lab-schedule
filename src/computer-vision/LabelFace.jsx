import {
	useState,
	useEffect,
	useRef,
	useContext,
	forwardRef,
	useImperativeHandle,
} from "react";
import { CVContext } from "/src/contexts/CVContext";
import * as faceapi from "face-api.js";
import Button from "react-bootstrap/Button";

export default forwardRef(function LabelFace({ imgDataURL, setCaptured }, ref) {
	const cVContext = useContext(CVContext);
	const {
		dispatchLabeledFaces,
		dispatchFaceCollection,
		dispatchDetectedFace,
		detectedFace,
	} = cVContext;
	const [labelText, setLabelText] = useState("");
	const [errorMessage, setErrorMessage] = useState();
	const refDescriptor = useRef();
	useImperativeHandle(ref, () => ({
		reset,
	}));
	function reset() {
		dispatchDetectedFace({ type: "reset" });
		refDescriptor.current = null;
		setCaptured(false);
	}
	async function detectFace() {
		const fullFaceDescription = await faceapi
			.detectSingleFace(imgDataURL)
			.withFaceLandmarks()
			.withFaceDescriptor();
		if (!fullFaceDescription) {
			throw new Error("No face detected");
		}
		const { x, y, width, height } = fullFaceDescription.detection.box;
		const regionsToExtract = [new faceapi.Rect(x, y, width, height)];
		const canvases = await faceapi.extractFaces(
			imgDataURL,
			regionsToExtract,
		);
		const imgSrc = canvases[0].toDataURL();
		dispatchDetectedFace({
			type: "set_src",
			payload: imgSrc,
		});
		refDescriptor.current = [fullFaceDescription.descriptor];
	}
	const addLabel = (e) => {
		e.preventDefault();
		const faceDescriptors = refDescriptor.current;
		const newLabeledFace = new faceapi.LabeledFaceDescriptors(
			labelText,
			faceDescriptors,
		);
		dispatchLabeledFaces({
			type: "added",
			payload: newLabeledFace,
		});
		dispatchFaceCollection({
			type: "added",
			payload: detectedFace.src,
		});
		setLabelText("");
		reset();
	};
	useEffect(() => {
		if (imgDataURL) {
			detectFace().catch((error) => {
				dispatchDetectedFace({
					type: "set_error_message",
					payload: error.message,
				});
			});
		}
	}, [imgDataURL]);
	return (
		<div>
			<form onSubmit={addLabel}>
				<input
					value={labelText}
					onChange={(e) => {
						setLabelText(e.target.value);
					}}
				/>
				<Button
					type="submit"
					disabled={!detectedFace.src || labelText == ""}
				>
					Add Labeled Face
				</Button>
			</form>
		</div>
	);
});
