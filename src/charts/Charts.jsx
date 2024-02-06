import { useRef } from "react";
import Button from "react-bootstrap/Button";
export default function Charts() {
	const fileInputRef = useRef();

	function handleUpload() {
		fileInputRef.current?.click();
		console.log(fileInputRef.current);
	}
	return (
		<div>
			<Button className="center-fit" onClick={handleUpload}>
				Up load a data file
			</Button>
			<input type="file" ref={fileInputRef} className="non-display" />
		</div>
	);
}
