import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { createWorker, PSM } from "tesseract.js";

export default function TextDetection() {
	const refVideo = useRef();
	const refCanvas = useRef();
	const refTracks = useRef();
	const capture = useCallback(async () => {
		const canvas = refCanvas.current;
		const video = refVideo.current;
		const ctx = canvas.getContext("2d");
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
		const img = canvas.toDataURL("image/png");
		const worker = await createWorker("eng");
		await worker.setParameters({
			tessedit_pageseg_mode: PSM.SPARSE_TEXT,
		});
		const res = await worker.recognize(img);
		console.log(res);
		await worker.terminate();
	}, []);
	useEffect(() => {
		(async () => {
			const video = refVideo.current;
			const canvas = refCanvas.current;
			const stream = await navigator.mediaDevices.getUserMedia({
				video: true,
			});
			video.srcObject = stream;
			video.play();
			video.onresize = () => {
				canvas.width = video.videoWidth;
				canvas.height = video.videoHeight;
			};
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
			<video ref={refVideo} muted controls />
			<canvas ref={refCanvas} style={{ border: "1px solid black" }} />
			<button type="button" onClick={capture}>
				Capture
			</button>
		</>
	);
}
