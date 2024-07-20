import { memo, useContext } from "react";
import Button from "react-bootstrap/Button";
import VideoStream from "/src/computer-vision/classes/VideoStream";
import { CVContext } from "/src/contexts/CVContext";

export default memo(function FlipCamButton() {
	const { activeStreams } = useContext(CVContext);
	return (
		activeStreams && (
			<Button
				type="button"
				style={{ position: "absolute", display: "block", top: "0" }}
				onClick={() => {
					VideoStream.switchTogether(...activeStreams);
				}}
			>
				Flip
			</Button>
		)
	);
});
