document.addEventListener("DOMContentLoaded", () => {
	// IMPORTANT!!
	const BACKEND_HOST =
		window.location.hostname === "127.0.0.1"
			? "http://localhost:3000"
			: "https://amy-s-blog-backend.onrender.com";

	const API_URL = `${BACKEND_HOST}/api`;

	const loadingState = document.getElementById("loading-state");
	const blogArticle = document.getElementById("blog-article");
	const errorMessage = document.getElementById("error-message");

	const postTitle = document.getElementById("post-title");
	const postDate = document.getElementById("post-date");
	const postContent = document.getElementById("post-content");

	const readMoreContainer = document.getElementById("read-more-container");
	const readMoreButton = document.getElementById("read-more-btn");

	// Recommended posts elements
	const recommendedContainer = document.getElementById(
		"recommended-posts-container"
	);

	const params = new URLSearchParams(window.location.search);
	const postId = params.get("id");

	/**
	 * Fetches a single blog post by its ID and renders it.
	 */
	const fetchSinglePost = async () => {
		// Get post ID from URL (e.g., ?id=1)

		if (!postId) {
			showError();
			return;
		}

		try {
			const response = await fetch(`${API_URL}/blogs/${postId}`);
			if (!response.ok) throw new Error("Post not found");
			const post = await response.json();

			document.title = post.title;
			postTitle.textContent = post.title;
			postDate.textContent = `Published on ${new Date(
				post.created_at
			).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
			})}`;
			postContent.innerHTML = post.content;

			// --- "Read More" Logic ---
			// Use textContent to get a plain text representation for word counting
			const wordCount = postContent.textContent.trim().split(/\s+/).length;
			if (wordCount > 180) {
				postContent.classList.add("truncated");
				readMoreContainer.classList.remove("hidden");

				readMoreButton.addEventListener("click", () => {
					postContent.classList.remove("truncated");
					readMoreContainer.classList.add("hidden");
				});
			}
			// --- End of "Read More" Logic ---

			loadingState.classList.add("hidden");
			blogArticle.classList.remove("hidden");
		} catch (error) {
			console.error("Error fetching single post:", error);
			showError();
		}
	};

	const showError = () => {
		loadingState.classList.add("hidden");
		errorMessage.classList.remove("hidden");
	};

	const fetchRecommendedPosts = async () => {
		try {
			const response = await fetch(`${API_URL}/blogs/${postId}/recommended`);
			if (!response.ok) throw new Error("Could not fetch recommendations");
			const recommendedPosts = await response.json();

			renderRecommendedPosts(recommendedPosts);
		} catch (error) {
			console.error("Error fetching recommendations:", error);
			recommendedContainer.innerHTML = `<p class="text-sm text-gray-500">Could not load recommendations.</p>`;
		}
	};

	const renderRecommendedPosts = (posts) => {
		recommendedContainer.innerHTML = ""; // Clear skeletons
		if (posts.length === 0) {
			recommendedContainer.innerHTML = `<p class="text-sm text-gray-500">No related articles found.</p>`;
			return;
		}
		const list = document.createElement("ul");
		list.className = "space-y-3";
		posts.forEach((post) => {
			const item = document.createElement("li");
			// STYLING UPDATE: Added classes to the <a> tag for background, shadow, and hover effects.
			item.innerHTML = `<a href="blog-post.html?id=${post.id}" class="block p-3 bg-gray-100 rounded-md shadow-sm hover:bg-blue-100 hover:shadow-md transition-all duration-200 text-gray-700 hover:text-secondary font-medium">${post.title}</a>`;
			list.appendChild(item);
		});
		recommendedContainer.appendChild(list);
	};

	if (postId) {
		fetchSinglePost();
		fetchRecommendedPosts();
	} else {
		showError();
	}

	fetchSinglePost();
});
