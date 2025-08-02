const searchButton = document.getElementById("searchButton");
const searchQueryInput = document.getElementById("searchQuery");
const leftSidePanel = document.getElementById("leftSidePanel");
const resultsContainer = document.getElementById("resultsContainer");
const loadingIndicator = document.getElementById("loadingIndicator");
const errorIndicator = document.getElementById("errorIndicator");
const suggestionsContainer = document.getElementById("suggestionsContainer");

// IMPORTANT!!
const BACKEND_HOST =
	window.location.hostname === "127.0.0.1"
		? "http://localhost:3000"
		: "https://amy-s-blog-backend.onrender.com";

const BACKEND_URL = `${BACKEND_HOST}/api`;

// Getting the search input's parent div to place validation messages
const searchInputParent = leftSidePanel;
const searchErrorMessageId = "search-error-message";

let debounceTimer;
const DEBOUNCE_DELAY = 300; // milliseconds for autocomplete suggestions

// --- New Validation Constants ---
const MIN_QUERY_LENGTH = 2; // Minimum number of characters for a valid query
const VALID_CHARACTERS_REGEX = /^[a-zA-Z0-9\s-]*$/; // Alphanumeric, spaces, and hyphens

searchButton.addEventListener("click", performSearch);
searchQueryInput.addEventListener("keypress", (event) => {
	if (event.key === "Enter") {
		performSearch();
		clearSuggestions(); // Clear suggestions after search
	}
});

searchQueryInput.addEventListener("input", (event) => {
	clearSearchError(); // Clear any previous error message

	const query = event.target.value.trim();
	if (searchQueryInput.value.length === 0) {
		resultsContainer.classList.add("hidden");
		clearSearchError();
		clearSuggestions();
	}
	clearTimeout(debounceTimer);
	debounceTimer = setTimeout(() => {
		fetchSuggestions(event.target.value);
	}, DEBOUNCE_DELAY);
});

searchQueryInput.addEventListener("focus", () => {
	// Re-fetch suggestions if input has content when focused
	clearSearchError();
	const query = searchQueryInput.value.trim();
	if (query.length >= MIN_QUERY_LENGTH) {
		fetchSuggestions(query);
	} else if (searchQueryInput.value.length === 0) {
		resultsContainer.classList.add("hidden");
	}
});

searchQueryInput.addEventListener("blur", () => {
	// Delay clearing suggestions to allow click on suggestion
	// This is a common pattern to ensure clicks on suggestions register before the dropdown disappears
	setTimeout(clearSuggestions, 150);
});

// Add this event listener to prevent the input from blurring prematurely
suggestionsContainer.addEventListener("mousedown", (event) => {
	// Prevent the default mousedown action on the suggestions container
	// This stops the input from blurring when a suggestion is clicked,
	// ensuring the click event on the suggestion item is fully processed.
	event.preventDefault();
});

// --- NEW: Helper function to validate the search query ---
function validateSearchQuery(query) {
	if (query.length < MIN_QUERY_LENGTH && query.length != 0) {
		displaySearchError(
			`Search query must be at least ${MIN_QUERY_LENGTH} characters long.`
		);
		return false;
	}
	if (!VALID_CHARACTERS_REGEX.test(query)) {
		displaySearchError(
			"Search query contains invalid characters. Please use letters, numbers, spaces, and hyphens only."
		);
		return false;
	}
	return true;
}

// --- NEW: Helper function to display a validation error message ---
function displaySearchError(message) {
	// Check if an error message already exists
	let errorMessage = document.getElementById(searchErrorMessageId);

	if (!errorMessage) {
		errorMessage = document.createElement("p");
		errorMessage.id = searchErrorMessageId;
		errorMessage.className = "text-red-500 text-sm mt-1"; // Tailwind classes for styling
		searchInputParent.appendChild(errorMessage);
	}
	errorMessage.textContent = message;
}

// --- NEW: Helper function to clear the validation error message ---
function clearSearchError() {
	const errorMessage = document.getElementById(searchErrorMessageId);
	if (errorMessage) {
		errorMessage.remove();
	}
}

async function fetchSuggestions(query) {
	if (!validateSearchQuery(query)) {
		clearSuggestions();
		return;
	}
	try {
		// Correct endpoint for suggestions
		const response = await fetch(
			`${BACKEND_URL}/search/suggestions?q=${encodeURIComponent(query)}`
		);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const suggestions = await response.json();
		displaySuggestions(suggestions);
	} catch (error) {
		console.error("Error fetching suggestions:", error);
		clearSuggestions();
	}
}

function displaySuggestions(suggestions) {
	suggestionsContainer.innerHTML = "";
	if (suggestions.length > 0) {
		suggestions.forEach((suggestion) => {
			const item = document.createElement("div");
			item.className =
				"autocomplete-suggestion-item text-gray-700 hover:bg-gray-100";
			item.textContent = suggestion.title;
			item.addEventListener("click", () => {
				searchQueryInput.value = suggestion.title; // Set input to selected suggestion
				performSearch(); // Perform search immediately
				clearSuggestions();
			});
			suggestionsContainer.appendChild(item);
		});
		suggestionsContainer.classList.remove("hidden");
	} else {
		suggestionsContainer.classList.add("hidden");
	}
}

function clearSuggestions() {
	suggestionsContainer.innerHTML = "";
	suggestionsContainer.classList.add("hidden");
}

async function performSearch() {
	const query = searchQueryInput.value.trim();
	if (!query) {
		resultsContainer.classList.remove("hidden");
		resultsContainer.innerHTML =
			'<p class="text-red-500 text-center">Please enter a search query.</p>';
		return;
	}
	if (!validateSearchQuery(query)) {
		// If validation fails, stop the function and show an error
		return;
	}

	resultsContainer.innerHTML = ""; // Clear previous results
	loadingIndicator.classList.remove("hidden"); // Show loading indicator

	try {
		// Endpoint for hybrid search
		const response = await fetch(
			`${BACKEND_URL}/search?query=${encodeURIComponent(query)}`,
			{
				method: "POST", // Specify POST method
				headers: {
					"Content-Type": "application/json", // Indicate JSON body
				},
				body: JSON.stringify({ query: query }), // Send query in the body as JSON
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				errorData.message || `HTTP error! status: ${response.status}`
			);
		}

		const data = await response.json();

		if (data.results && data.results.length > 0) {
			data.results.forEach((post) => {
				const postElement = document.createElement("div");
				postElement.className =
					"bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200";

				// Create elements and use textContent for XSS safety
				const titleElement = document.createElement("h3");
				titleElement.className = "text-lg font-semibold text-gray-800 mb-1";
				titleElement.textContent = post.title; // SAFE: Uses textContent

				const contentElement = document.createElement("p");
				contentElement.className = "text-sm text-gray-600 mb-2 line-clamp-3";
				contentElement.textContent = post.content; // SAFE: Uses textContent

				const scoreElement = document.createElement("p");
				scoreElement.className = "text-xs text-gray-400";
				scoreElement.textContent = `Score: ${
					post.score ? post.score.toFixed(4) : "N/A"
				}`; // SAFE: Uses textContent

				const readMoreLink = document.createElement("a");
				readMoreLink.href = `blog-post.html?id=${post.id}`;
				readMoreLink.className =
					"text-blue-500 hover:underline text-sm mt-2 inline-block";
				readMoreLink.textContent = "Read More →"; // SAFE: Uses textContent

				postElement.appendChild(titleElement);
				postElement.appendChild(contentElement);
				postElement.appendChild(scoreElement);
				postElement.appendChild(readMoreLink);

				resultsContainer.appendChild(postElement);
				resultsContainer.classList.remove("hidden");
			});
		} else {
			resultsContainer.textContent =
				'<p class="text-gray-500 text-center">No blog posts found for your query.</p>';
		}
	} catch (error) {
		console.error("Search failed:", error);
		resultsContainer.textContent = `<p class="text-red-500 text-center">Error during search: ${error.message}. Please check your backend server.</p>`;
	} finally {
		loadingIndicator.classList.add("hidden"); // Hide loading indicator
	}
}
