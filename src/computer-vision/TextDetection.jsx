import {
	useLayoutEffect,
	useEffect,
	useState,
	forwardRef,
	useImperativeHandle,
	cloneElement,
} from "react";
import { createWorker, PSM } from "tesseract.js";
import ProgressBar from "react-bootstrap/ProgressBar";
import { variants } from "/src/config";
const myVariants = variants().filter((e) => !["light", "link"].includes(e));
const TextDetection = forwardRef(function TextDetection(
	{ imgDataURL, id, setId },
	ref,
) {
	const [status, setStatus] = useState();
	const [progress, setProgress] = useState(0);
	const [variant, setVariant] = useState();
	const [worker, setWorker] = useState();
	const [incomplete, setIncomplete] = useState(true);
	const [myProgress, setMyProgress] = useState([1]);
	const [recreateProgress, setRecreateProgress] = useState(0);
	function reset() {
		setProgress(1);
		setStatus();
	}
	useImperativeHandle(ref, () => ({
		reset,
	}));
	useLayoutEffect(() => {
		if (imgDataURL) {
			(async () => {
				if (!worker) {
					const worker = await createWorker("eng", 1, {
						logger: (m) => {
							const { status, progress } = m;
							setStatus(status);
							setProgress(progress);
						},
					});
					const ready = await worker.setParameters({
						tessedit_pageseg_mode: PSM.SPARSE_TEXT,
						tessedit_char_whitelist: "0123456789",
					});
					if (ready) setWorker(worker);
				} else {
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
				}
			})();
		}
	}, [imgDataURL, worker]);
	useLayoutEffect(() => {
		if (status) {
			const i = myVariants.indexOf(variant);
			setVariant(myVariants[(i + 1) % myVariants.length]);
		}
		setMyProgress([]);
		setRecreateProgress((state) => state + 1);
	}, [status]);
	useLayoutEffect(() => {
		setMyProgress([1]);
	}, [recreateProgress]);
	useLayoutEffect(() => {
		(async () => {
			const worker = await createWorker("eng", 1, {
				logger: (m) => {
					const { status, progress } = m;
					setStatus(status);
					setProgress(progress);
				},
			});
			const ready = await worker.setParameters({
				tessedit_pageseg_mode: PSM.SPARSE_TEXT,
				tessedit_char_whitelist: "0123456789",
			});
			if (ready) {
				setWorker(worker);
				setTimeout(() => {
					reset();
				}, 1000);
			}
		})();
		return () => {
			if (worker) {
				(async () => {
					await worker.terminate();
				})();
			}
		};
	}, []);
	useEffect(() => {
		if (progress == 1) {
			setTimeout(() => {
				setIncomplete(false);
			}, 500);
		} else {
			setIncomplete(true);
		}
	}, [progress]);

	return (
		<>
			<div style={{ marginTop: ".25em" }}>
				<div
					style={{
						width: "fit-content",
						maxWidth: "90vw",
						margin: "auto",
					}}
				>
					{status ? status : "standby"}
				</div>
				<div
					style={{
						width: "10em",
						margin: "auto",
						maxWidth: "90vw",
					}}
				>
					{myProgress.map((e) => {
						return cloneElement(<ProgressBar />, {
							variant: variant,
							animated: incomplete,
							now: progress * 100,
						});
					})}
				</div>
			</div>
			<div style={{ width: "fit-content" }} className="flexbox-row">
				<div style={{ marginRight: "1em" }}>ID number: {id} </div>
			</div>
		</>
	);
});

export default TextDetection;
