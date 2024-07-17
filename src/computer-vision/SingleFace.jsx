import { useContext } from "react";
import { CVContext } from "/src/contexts/CVContext";
export default function SingleFace() {
	const {
		detectedFace: { src, errorMessage },
		detectedFace,
	} = useContext(CVContext);
	return (
		<div
			style={{
				width: "8em",
				height: "10em",
				border: "5px double black",
			}}
		>
			{src && (
				<div>
					<p>Face detected:</p>{" "}
					<img
						src={src}
						style={{
							width: "6em",
							height: "6em",
							objectFit: "cover",
						}}
					/>
				</div>
			)}
			{errorMessage && <p>{errorMessage}</p>}
		</div>
	);
}
