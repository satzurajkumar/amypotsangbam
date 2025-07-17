document.addEventListener("DOMContentLoaded", () => {
	// --- CONFIG ---
	// IMPORTANT: Replace this with the URL of your running backend server.
	const API_URL = "https://amy-s-blog-backend.onrender.com/api";

	const postsContainer = document.getElementById("blog-posts-container");
	const errorMessageContainer = document.getElementById("error-message");

	/**
	 * Fetches blog posts from the backend and renders them on the page.
	 */
	const fetchAndRenderPosts = async () => {
		try {
			const response = await fetch(`${API_URL}/blogs`);

			if (!response.ok) {
				throw new Error(
					`Failed to fetch posts. Server responded with ${response.status}`
				);
			}

			const posts = await response.json();

			// Clear the loading skeletons
			postsContainer.innerHTML = "";

			if (posts.length === 0) {
				postsContainer.innerHTML =
					'<p class="text-center col-span-full">No blog posts found yet. Check back soon!</p>';
				return;
			}

			// Render each post
			posts.forEach((post) => {
				const postElement = document.createElement("a");
				postElement.href = `blog-post.html?id=${post.id}`; // Link to a future single post page
				postElement.className =
					"blog-post-card block bg-light-bg p-8 rounded-lg shadow-sm";

				const postDate = new Date(post.created_at).toLocaleDateString("en-US", {
					year: "numeric",
					month: "long",
					day: "numeric",
				});

				postElement.innerHTML = `
                            <p class="text-sm text-gray-500 mb-2">${postDate}</p>
                            <h2 class="text-2xl font-serif text-dark mb-4">${post.title}</h2>
                            <span class="font-semibold text-secondary hover:underline">Read More &rarr;</span>
                        `;

				postsContainer.appendChild(postElement);
			});
		} catch (error) {
			console.error("Error fetching blog posts:", error);
			postsContainer.innerHTML = ""; // Clear skeletons on error
			errorMessageContainer.classList.remove("hidden");
			errorMessageContainer.textContent =
				"Could not load blog posts. Please ensure the backend server is running and accessible.";
		}
	};

	// Initial call to load the posts when the page is ready
	fetchAndRenderPosts();
});
