import { useEffect, useState } from "react";
export default function BlogPost({ content }) {
	console.log(content.fields.blogPost);
	return (
		<div style={{ border: "1px solid black", margin: "1em auto" }}>
			<h2>{content.fields.postTitle}</h2>
			<p>{content.fields.blogPost.content[0].content[0].value}</p>
		</div>
	);
}
