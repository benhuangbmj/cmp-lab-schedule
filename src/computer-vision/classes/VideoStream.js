export default class VideoStream {
	_stream;
	_video;
	_tracks;
	_canvas;
	_context;
	_animationFrame;
	_minDimension = 0;
	constructor(stream, video) {
		this._stream = stream;
		this._tracks = stream.getVideoTracks();
		if (video) {
			this._video = video;
			this._video.srcObject = this._stream;
		}
	}
	static async createVideoStream(callback) {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: false,
				video: {
					facingMode: "environment",
				},
			});
			callback(stream);
		} catch (err) {
			console.error(err);
		}
	}
	set setVideo(video) {
		this._video = video;
		this._video.srcObject = this._stream;
	}
	start() {
		if (!this._video) {
			return;
		}
		this._video.srcObject = this._stream;
		this._video.play();
	}

	stop() {
		this._tracks.forEach((track) => track.stop());
	}

	projectTo(canvas, highlightAspectRatio = 5.3 / 8) {
		if (!this._video) {
			return;
		}
		this._canvas = canvas;
		const video = this._video;
		video.onresize = () => {
			canvas.width = Math.min(document.documentElement.clientWidth, 400);
			canvas.height = canvas.width;
			this._minDimension = Math.min(video.videoWidth, video.videoHeight);
		};
		if (!this._context) {
			this._context = canvas.getContext("2d", {
				willReadFrequently: true,
			});
		}
		const context = this._context;
		const draw = () => {
			const offset = 15;
			const span = 1 - 2 / offset;
			const highlightedWidth = canvas.width * span;
			const highlightedHeight = highlightedWidth * highlightAspectRatio;
			const leftCornerX = canvas.width / offset;
			const leftCornerY = (canvas.height - highlightedHeight) / 2;
			this._highlightedWidth = highlightedWidth;
			this._highlightedHeight = highlightedHeight;
			this._leftCornerX = leftCornerX;
			this._leftCornerY = leftCornerY;
			context.drawImage(
				video,
				0,
				0,
				this._minDimension,
				this._minDimension,
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
			this._animationFrame = requestAnimationFrame(draw);
		};
		this._animationFrame = requestAnimationFrame(draw);
	}
	stopProjecting() {
		if (!this._animationFrame) {
			return;
		}
		cancelAnimationFrame(this._animationFrame);
		this._animationFrame = null;
	}
	restartProjecting() {
		this._video.play();
		this.projectTo(this._canvas);
	}
	captureImage() {
		if (!this._context) {
			return;
		}
		const context = this._context;
		const canvas = document.createElement("canvas");
		const capturedData = context.getImageData(
			this._leftCornerX,
			this._leftCornerY,
			this._highlightedWidth,
			this._highlightedHeight,
		);
		canvas.width = capturedData.width;
		canvas.height = capturedData.height;
		const ctx = canvas.getContext("2d");
		ctx.putImageData(capturedData, 0, 0);
		this.stopProjecting();
		this._video.pause();
		return canvas.toDataURL("image/png");
	}
	logProperties() {
		console.table([
			{ name: "stream", subject: this._stream },
			{ name: "video", subject: this._video },
			{ name: "tracks", subject: this._tracks },
			{ name: "animationFrame", subject: this._animationFrame },
			{ name: "minDimension", subject: this._minDimension },
		]);
	}
}
