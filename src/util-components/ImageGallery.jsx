export default function ImageGallery({ collection = [], captions = [] }) {
	return (
		<div
			className="flexbox-row"
			style={{
				boxSizing: "content-box",
				justifyContent: "flex-start",
				border: "5px double black",
				padding: "0.2em",
				height: "7em",
				overflowY: "auto",
				gap: ".25em",
			}}
		>
			{collection.map((src, i, arr) => (
				<figure
					key={i}
					className={i == arr.length - 1 ? "animation-fade-in" : ""}
				>
					<img
						src={src}
						style={{
							width: "5em",
							height: "5em",
							objectFit: "cover",
						}}
					/>
					<figcaption>{captions[i]}</figcaption>
				</figure>
			))}
		</div>
	);
}
