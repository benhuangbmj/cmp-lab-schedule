export default class Video {
	_stream;
	_video;
	_tracks;
	constructor(stream, video) {
		this._stream = stream;
		this._video = video;
		this._tracks = stream.getVideoTracks();
		this._video.srcObject = this._stream;
		this._video.style.width = "50vw";
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
	projectTo(canvas) {
		const video = this._video;
		let w;
		let h;
		video.onresize = () => {
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;
			w = video.videoWidth;
			h = video.videoHeight;
		};
		function draw() {
			const context = canvas.getContext("2d");
			context.drawImage(
				video,
				w / 6,
				h / 5,
				(4 * w) / 6,
				(3 * h) / 5,
				w / 6,
				h / 5,
				(4 * w) / 6,
				(3 * h) / 5,
			);
			requestAnimationFrame(draw);
		}
		draw();
	}
}
