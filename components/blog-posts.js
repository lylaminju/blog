import { posts } from "../data/posts.js";

class BlogPosts extends HTMLElement {
	constructor() {
		super();
		this.selectedCategory = "All";
	}

	connectedCallback() {
		this.render();
	}

	formatDate(dateStr) {
		const [year, month, day] = dateStr.split("-").map(Number);
		const date = new Date(year, month - 1, day);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "2-digit",
		});
	}

	getCategories() {
		const categories = new Set(
			posts.map((post) => post.category || "General"),
		);
		return ["All", ...Array.from(categories).sort()];
	}

	getFilteredPosts() {
		if (this.selectedCategory === "All") {
			return posts;
		}
		return posts.filter(
			(post) => (post.category || "General") === this.selectedCategory,
		);
	}

	handleCategoryChange(event) {
		this.selectedCategory = event.target.dataset.category;
		this.render();
	}

	render() {
		const categories = this.getCategories();
		const filteredPosts = this.getFilteredPosts();
		const grouped = Object.groupBy(filteredPosts, (post) => post.date.slice(0, 4));
		const years = Object.entries(grouped).sort(([a], [b]) => b - a);

		this.innerHTML = `
      <div class="blog-posts">
        <div class="blog-filters">
          <span class="filter-label">Category</span>
          <div class="category-menu" role="tablist" aria-label="Blog categories">
            ${categories
							.map(
								(category) => `
              <button
                type="button"
                class="category-chip ${category === this.selectedCategory ? "is-active" : ""}"
                data-category="${category}"
                role="tab"
                aria-selected="${category === this.selectedCategory ? "true" : "false"}"
              >
                ${category}
              </button>
            `,
							)
							.join("")}
          </div>
        </div>
        ${years
					.map(
						([year, yearPosts]) => `
            <h2 class="posts-year">${year}</h2>
            <ul class="posts-list">
              ${yearPosts
								.map(
									(post) => `
                  <li class="post-item">
                    <a href="posts/${post.slug}/" class="post-link">
                      <div class="post-main">
                        <div class="post-title">${post.title}</div>
                        <div class="post-category">${post.category || "General"}</div>
                      </div>
                      <div class="post-date">${this.formatDate(post.date)}</div>
                    </a>
                  </li>
                `,
								)
								.join("")}
            </ul>
          `,
					)
					.join("")}
        ${filteredPosts.length === 0 ? '<p class="no-posts">No posts in this category yet.</p>' : ""}
      </div>
    `;

		const categoryButtons = this.querySelectorAll(".category-chip");
		categoryButtons.forEach((button) => {
			button.addEventListener("click", this.handleCategoryChange.bind(this));
		});
	}
}

export default function registerBlogPosts() {
	customElements.define("blog-posts", BlogPosts);
}
