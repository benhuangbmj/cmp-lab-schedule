import { useEffect, useState } from "react";
import { apiBaseUrl } from "/src/utils";

import BlogPost from "/src/devBlog/BlogPost";
export default function PostDisplay() {
	const [blogPosts, setBlogPosts] = useState();
	useEffect(() => {
		fetch(apiBaseUrl + "/blog-posts")
			.then((res) => res.json())
			.then((res) => {
				setBlogPosts(res.items);
			});
	}, []);
	return (
		<main>
			{blogPosts &&
				blogPosts.map((post) => (
					<BlogPost key={post.sys.id} content={post} />
				))}{" "}
		</main>
	);
}
