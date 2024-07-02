import { useEffect, useState } from "react";
import { createWorker, PSM } from "tesseract.js";

export default function TextDetection({ imgDataURL, id, setId }) {
	useEffect(() => {
		if (imgDataURL) {
			(async () => {
				const worker = await createWorker("eng");
				await worker.setParameters({
					tessedit_pageseg_mode: PSM.SPARSE_TEXT,
					tessedit_char_whitelist: "0123456789",
				});
				const {
					data: { words },
				} = await worker.recognize(imgDataURL);
				if (words.length === 0) {
					setId("Capture failed. Please try again.");
				}
				for (let i = 0; i < words.length; i++) {
					if (words[i].text.length === 8) {
						setId(words[i].text);
						break;
					}
					if (i === words.length - 1) {
						setId("Capture failed. Please try again.");
					}
				}
				await worker.terminate();
			})();
		}
	}, [imgDataURL]);

	return (
		<div>
			<p>ID number: {id} </p>
		</div>
	);
}
