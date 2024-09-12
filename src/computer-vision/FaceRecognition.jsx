import {
	useEffect,
	useRef,
	useState,
	useCallback,
	useContext,
	memo,
} from "react";
import VideoStream from "/src/computer-vision/classes/VideoStream";
import ShootingWindow from "/src/computer-vision/ShootingWindow";
import CaptureImage from "/src/computer-vision/CaptureImage";
import LabelFace from "/src/computer-vision/LabelFace";
import ImageGallery from "/src/util-components/ImageGallery";
import SingleFace from "/src/computer-vision/SingleFace";
import RecognizeFaces from "/src/computer-vision/RecognizeFaces";
import FlipCamButton from "/src/computer-vision/FlipCamButton";
import { CVContext } from "/src/contexts/CVContext";
import Button from "react-bootstrap/Button";
const MODEL_URL = "/models";
export default function FaceRecognition() {
	const cVContext = useContext(CVContext);
	const [loaded, setLoaded] = useState(false);
	const {
		recognizeStream,
		dispatchRecognizeStream,
		labelStream,
		dispatchLabelStream,
		faceCollection,
		labeledFaces,
		dispatchLabeledFaces,
		faceapi,
		dispatchActiveStreams,
	} = cVContext;
	const refLabelFace = useRef();
	const refCaptureImage = useRef();
	useEffect(() => {
		VideoStream.createVideoStream((stream) => {
			dispatchRecognizeStream({
				type: "set",
				payload: new VideoStream(stream),
			});
			dispatchLabelStream({
				type: "set",
				payload: new VideoStream(stream),
			});
		});
		prepare();
	}, []);
	useEffect(() => {
		if (recognizeStream && labelStream) {
			dispatchActiveStreams({
				type: "set",
				payload: [recognizeStream, labelStream],
			});
		}
		return () => {
			recognizeStream?.stop();
			labelStream?.stop();
		};
	}, [recognizeStream, labelStream]);
	return (
		<>
			<div
				className="flexbox-row"
				style={{ justifyContent: "center", gap: "1em 2em" }}
			>
				<ShootingWindow loaded={loaded} />
				<SingleFace
					src={refLabelFace.current?.imgSrc}
					errorMessage={refLabelFace.current?.errorMessage}
				/>
			</div>
			<CaptureImage
				ref={refCaptureImage}
				videoStream={labelStream}
				streamStopped={false}
				toDataURL={false}
				triggerText="Capture Face"
				reset={refLabelFace.current?.reset}
			>
				<LabelFace
					ref={refLabelFace}
					setCaptured={refCaptureImage.current?.setCaptured}
				/>
			</CaptureImage>
			<ImageGallery
				collection={faceCollection}
				captions={labeledFaces.map((e) => e.label)}
			/>
			<RecognizeFaces />
		</>
	);
	function prepare() {
		Promise.all([
			faceapi.loadSsdMobilenetv1Model(MODEL_URL),
			faceapi.loadFaceLandmarkModel(MODEL_URL),
			faceapi.loadFaceRecognitionModel(MODEL_URL),
		]).then(() => {
			setLoaded(true);
		});
	}
}
