export default class Video {
	_stream;
	_video;
	_tracks;
	constructor(stream, video) {
		this._stream = stream;
		this._video = video;
		this._tracks = stream.getVideoTracks();
		this._video.srcObject = this._stream;
		console.table([
			{ name: "stream", subject: this._stream },
			{ name: "video", subject: this._video },
			{ name: "tracks", subject: this._tracks },
		]);
	}
	start() {
		this._video.srcObject = this._stream;
		this._video.play();
	}

	stop() {
		this._tracks.forEach((track) => track.stop());
	}

	projectTo(canvas, highlightAspectRatio = 5.4 / 8) {
		const video = this._video;
		let minDimension;
		video.onresize = () => {
			minDimension = Math.min(video.videoWidth, video.videoHeight);
			canvas.width = Math.min(document.documentElement.clientWidth, 600);
			const r = canvas.width / minDimension;
			canvas.height = minDimension * r;
		};
		const context = canvas.getContext("2d", {
			willReadFrequently: true,
		});
		function draw() {
			const offset = 15;
			const span = 1 - 2 / offset;
			const highlightedWidth = canvas.width * span;
			const highlightedHeight = highlightedWidth * highlightAspectRatio;
			const leftCornerX = canvas.width / offset;
			const leftCornerY = (canvas.height - highlightedHeight) / 2;
			context.drawImage(
				video,
				0,
				0,
				minDimension,
				minDimension,
				0,
				0,
				canvas.width,
				canvas.height,
			);
			const background = context.getImageData(
				0,
				0,
				canvas.width,
				canvas.height,
			);

			const highlighted = context.getImageData(
				leftCornerX,
				leftCornerY,
				highlightedWidth,
				highlightedHeight,
			);
			for (let i = 0; i < background.data.length; i += 4) {
				for (let j = 0; j < 3; j++) {
					background.data[i + j] *= 0.5;
				}
			}
			context.putImageData(background, 0, 0);
			context.putImageData(highlighted, leftCornerX, leftCornerY);

			requestAnimationFrame(draw);
		}
		draw();
	}
}
