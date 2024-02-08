import { useRef } from "react";
import Papa from "papaparse";
import { apiBaseUrl as base } from "/src/utils";
import Button from "react-bootstrap/Button";

const headers = [
	"id",
	"start_time",
	"completion_time",
	"email",
	"name",
	"username",
	"courses",
	"rating",
	"feedback",
	"words",
];

export default function UploadUsage() {
	const fileInputRef = useRef();
	const url = new URL("upload-usage", base);
	function handleUpload(e) {
		Papa.parse(e.target.files[0], {
			header: true,
			transformHeader: function (header, i) {
				return headers[i];
			},
			skipEmptyLines: true,
			complete: function (results) {
				fetch(url, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(results),
				});
			},
		});
	}
	return (
		<>
			<Button
				className="center-fit"
				onClick={() => fileInputRef.current?.click()}
			>
				Upload the data file
			</Button>
			<input
				type="file"
				ref={fileInputRef}
				className="non-display"
				onChange={handleUpload}
				accept=".csv"
			/>
		</>
	);
}
