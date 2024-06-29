import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { createWorker, PSM } from "tesseract.js";

export default function TextDetection() {
	const refVideo = useRef();
	const refCanvas = useRef();
	const refTracks = useRef();
	const [num, setNum] = useState();
	const capture = useCallback(async () => {
		const canvas = refCanvas.current;
		const video = refVideo.current;
		const ctx = canvas.getContext("2d");
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
		const img = canvas.toDataURL("image/png");
		const worker = await createWorker("eng");
		await worker.setParameters({
			tessedit_pageseg_mode: PSM.SPARSE_TEXT,
			tessedit_char_whitelist: "0123456789",
		});
		const {
			data: { words },
		} = await worker.recognize(img);
		console.log(words[0]);
		setNum(words[0].text);
		await worker.terminate();
	}, []);
	useEffect(() => {
		(async () => {
			const video = refVideo.current;
			const canvas = refCanvas.current;
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: false,
				video: {
					facingMode: "environment",
				},
			});
			video.srcObject = stream;
			video.play();
			refTracks.current = stream.getVideoTracks();
		})();
		return () => {
			refTracks.current.forEach((track) => {
				track.stop();
			});
		};
	}, []);

	return (
		<>
			<button type="button" onClick={capture}>
				Capture
			</button>
			<p>ID number: {num} </p>
			<video ref={refVideo} muted controls width="200px" height="200px" />
			<canvas
				ref={refCanvas}
				style={{ border: "1px solid black" }}
				width="200px"
				height="200px"
			/>
		</>
	);
}
