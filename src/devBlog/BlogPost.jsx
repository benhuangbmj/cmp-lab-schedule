import { useEffect, useState } from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS } from "@contentful/rich-text-types";

function renderEntry(node, children) {
	if (node.data.target.sys.contentType.sys.id === "videoEmbed") {
		return (
			<iframe
				src={node.data.target.fields.embedUrl}
				height="100%"
				width="100%"
				frameBorder="0"
				scrolling="no"
				title={node.data.target.fields.title}
				allowFullScreen={true}
			/>
		);
	}
}

function renderAsset(node, children) {
	return (
		<img
			src={`https://${node.data.target.fields.file.url}`}
			height={node.data.target.fields.file.details.image.height}
			width={node.data.target.fields.file.details.image.width}
			alt={node.data.target.fields.description}
		/>
	);
}

const renderOptions = {
	renderNode: {
		[BLOCKS.EMBEDDED_ENTRY]: renderEntry,
		[BLOCKS.EMBEDDED_RESOURCE]: renderEntry,
		[BLOCKS.EMBEDDED_ASSET]: renderAsset,
	},
};

export default function BlogPost({ content }) {
	return (
		<div style={{ border: "1px solid black", margin: "1em auto" }}>
			<h2>{content.fields.postTitle}</h2>
			{documentToReactComponents(content.fields.blogPost, renderOptions)}
		</div>
	);
}
