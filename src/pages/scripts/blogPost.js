document.addEventListener("DOMContentLoaded", () => {
	const API_URL = "https://amy-s-blog-backend.onrender.com/api";

	const loadingState = document.getElementById("loading-state");
	const blogArticle = document.getElementById("blog-article");
	const errorMessage = document.getElementById("error-message");

	const postTitle = document.getElementById("post-title");
	const postDate = document.getElementById("post-date");
	const postContent = document.getElementById("post-content");

	/**
	 * Fetches a single blog post by its ID and renders it.
	 */
	const fetchSinglePost = async () => {
		// Get post ID from URL (e.g., ?id=1)
		const params = new URLSearchParams(window.location.search);
		const postId = params.get("id");

		if (!postId) {
			showError();
			return;
		}

		try {
			const response = await fetch(`${API_URL}/blogs/${postId}`);

			if (!response.ok) {
				throw new Error("Post not found");
			}

			const post = await response.json();

			// Populate the page with the fetched data
			document.title = post.title; // Update the page tab title
			postTitle.textContent = post.title;
			postDate.textContent = `Published on ${new Date(
				post.created_at
			).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
			})}`;
			postContent.innerHTML = post.content; // Use .innerHTML to render any HTML in the content

			// Show the article and hide loading state
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

	fetchSinglePost();
});
