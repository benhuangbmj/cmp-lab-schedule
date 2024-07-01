import { useEffect, useState } from "react";
import { createWorker, PSM } from "tesseract.js";

export default function TextDetection({ imgDataURL, num, setNum }) {
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
				console.log(words); //remove
				if (words.length === 0) {
					setNum("Capture failed. Please try again.");
				}
				for (let i = 0; i < words.length; i++) {
					if (words[i].text.length === 8) {
						setNum(words[i].text);
						break;
					}
					if (i === words.length - 1) {
						setNum("Capture failed. Please try again.");
					}
				}
				await worker.terminate();
			})();
		}
	}, [imgDataURL]);

	return (
		<div>
			<p>ID number: {num} </p>
		</div>
	);
}
