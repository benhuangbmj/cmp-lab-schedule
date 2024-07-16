import { cloneElement } from "react";
export default function ImageGallery({ collection = [] }) {
	return (
		<div
			className="flexbox-row"
			style={{
				justifyContent: "flex-start",
				border: "5px double black",
				padding: "0.2em",
			}}
		>
			{collection.map((img, i, arr) =>
				cloneElement(img, {
					key: i,
					className: i == arr.length - 1 ? "animation-fade-in" : "",
				}),
			)}
		</div>
	);
}
