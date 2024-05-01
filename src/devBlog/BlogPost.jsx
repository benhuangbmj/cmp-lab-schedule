import { useEffect, useState } from "react";
export default function BlogPost({ content }) {
	console.log(content.fields.blogPost);
	return (
		<div>
			<h2>{content.fields.postTitle}</h2>
			<p>{content.fields.blogPost.content[0].content[0].value}</p>
		</div>
	);
}
