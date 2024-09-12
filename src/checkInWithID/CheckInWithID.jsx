import DetectID from "/src/checkInWithID/components/DetectID";
import Banner from "/src/util-components/Banner";
import { CVContextProvider } from "/src/contexts/CVContext";
export default function CheckInWithID() {
	return (
		<>
			<Banner text="This is a front-end demo only." />
			<CVContextProvider>
				<DetectID />
			</CVContextProvider>
		</>
	);
}
