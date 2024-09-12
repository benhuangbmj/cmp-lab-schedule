import FaceRecognition from "/src/computer-vision/FaceRecognition";
import Banner from "/src/util-components/Banner";
import { CVContextProvider } from "/src/contexts/CVContext";
export default function CheckInWithFace() {
	return (
		<>
			<Banner text="This is a front-end demo only." />
			<CVContextProvider>
				<FaceRecognition />
			</CVContextProvider>
		</>
	);
}
