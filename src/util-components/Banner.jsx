import { useContext } from "react";
import { AppContext } from "/src/contexts/AppContext";
export default function Banner({ text, checkOffline }) {
	const { offline } = useContext(AppContext);
	return (
		(!checkOffline || offline) && (
			<div
				style={{
					backgroundColor: "red",
					color: "white",
				}}
			>
				{text}
			</div>
		)
	);
}
