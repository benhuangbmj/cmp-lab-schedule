import FaceRecognition from "/src/computer-vision/FaceRecognition";
import { CVContextProvider } from "/src/contexts/CVContext";
export default function CheckInWithFace() {
	return (
		<main>
			<CVContextProvider>
				<FaceRecognition />
			</CVContextProvider>
		</main>
	);
}
