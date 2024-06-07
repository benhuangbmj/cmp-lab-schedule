import { useEffect, useState } from "react";
import { apiBaseUrl } from "/src/utils";
import dayjs from "dayjs";

import BlogPost from "/src/devBlog/BlogPost";
export default function PostDisplay() {
	const [blogPosts, setBlogPosts] = useState();
	useEffect(() => {
		fetch(apiBaseUrl + "/blog-posts")
			.then((res) => res.json())
			.then((res) => {
				res.items.sort((a, b) => {
					const date1 = dayjs(a.sys.createdAt);
					const date2 = dayjs(b.sys.createdAt);
					return date2.diff(date1);
				});
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
