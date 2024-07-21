import DetectID from "/src/checkInWithID/components/DetectID";
import { CVContextProvider } from "/src/contexts/CVContext";
export default function CheckInWithID() {
	return (
		<main>
			<CVContextProvider>
				<DetectID />
			</CVContextProvider>
		</main>
	);
}
