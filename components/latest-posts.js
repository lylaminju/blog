import { posts } from "../data/posts.js";

class LatestPosts extends HTMLElement {
	getBasePath() {
		const depth = window.location.pathname.split("/").filter(Boolean).length;

		return depth === 0 ? "./" : "../".repeat(depth);
	}

	formatDate(dateStr) {
		const [year, month, day] = dateStr.split("-").map(Number);
		const date = new Date(year, month - 1, day);

		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	}

	renderPost(post) {
		const basePath = this.getBasePath();
		const description = post.description
			? `<span class="latest-post-note">${post.description}</span>`
			: "";

		return `
			<li class="latest-post">
				<a href="${basePath}posts/${post.slug}/" class="latest-post-link">
					<span class="latest-post-meta">
						${post.category || "General"} · ${this.formatDate(post.date)}
						</span>
						<span class="latest-post-title">${post.title}</span>
						${description}
					</a>
				</li>
			`;
	}

	connectedCallback() {
		const latest = posts.slice(0, 3);

		this.innerHTML = `
			<ul class="latest-posts-list">
				${latest.map((post) => this.renderPost(post)).join("")}
			</ul>
		`;
	}
}

export default function registerLatestPosts() {
	customElements.define("latest-posts", LatestPosts);
}
