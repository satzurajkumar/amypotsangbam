// --- AI Assistant Elements ---
const aiTopicInput = document.getElementById("ai-topic");
const blogTopicInput = document.getElementById("blog-title");
const generateTitlesBtn = document.getElementById("generate-titles-btn");
const generatePostBtn = document.getElementById("generate-post-btn");

const titleSuggestions = document.getElementById("title-suggestions");
const aiLoader = document.getElementById("ai-loader");

const loaderText = document.getElementById("loaderText");
const welcomeMessage = document.getElementById("welcomeMessage");

// IMPORTANT!!
const BACKEND_HOST =
	window.location.hostname === "127.0.0.1"
		? "http://localhost:3000"
		: "https://amy-s-blog-backend.onrender.com";

// const API_BASE_URL = "https://amy-s-blog-backend.onrender.com/api/googleGenAI"; // Ensure this matches your Node.js server port
const API_BASE_URL = `${BACKEND_HOST}/api/googleGenAI`;
let isLoading = false; // Flag to manage overall loading state

// Utility function to set loading state
// function setLoading(activeTask, text = "Loading...") {
// 	isLoading = true;
// 	topicInput.disabled = true;
// 	generateIdeasBtn.disabled = true;
// 	writePostBtn.disabled = true;

// 	welcomeMessage.classList.add("hidden");
// 	imageDisplayContainer.classList.add("hidden");
// 	blogDisplayContainer.classList.add("hidden");
// 	ideaListContainer.classList.add("hidden");
// 	errorDisplay.classList.add("hidden");

// }

// Utility function to clear loading state
// function clearLoading() {
// 	isLoading = false;
// 	topicInput.disabled = false;
// 	generateIdeasBtn.disabled = false;
// 	writePostBtn.disabled = false;

// 	loader.classList.add("hidden");

// 	// Show welcome message if no content is displayed
// 	if (
// 		blogDisplayContainer.classList.contains("hidden") &&
// 		imageDisplayContainer.classList.contains("hidden") &&
// 		ideaListContainer.classList.contains("hidden")
// 	) {
// 		welcomeMessage.classList.remove("hidden");
// 	}
// }

// Utility function to display error
function displayError(message) {
	setError(message); // Use the existing setError function
}

function setError(message) {
	errorMessage.textContent = message;
	errorDisplay.classList.remove("hidden");
	welcomeMessage.classList.add("hidden"); // Hide welcome message on error
}

function clearContent() {
	blogDisplayContainer.innerHTML = "";
	generatedImageElem.src = "";
	ideaList.innerHTML = "";
	welcomeMessage.classList.remove("hidden");
	imageDisplayContainer.classList.add("hidden");
	blogDisplayContainer.classList.add("hidden");
	ideaListContainer.classList.add("hidden");
	errorDisplay.classList.add("hidden");
}

// --- Event Handlers ---

generateTitlesBtn.addEventListener("click", async () => {
	const topic = aiTopicInput.value.trim();
	const token = localStorage.getItem("token");

	if (!topic) {
		setError("Please enter a topic first.");
		return;
	}
	aiLoader.classList.remove("hidden");
	[generateTitlesBtn, generatePostBtn].forEach((btn) => (btn.disabled = true));
	try {
		const response = await fetch(`${API_BASE_URL}/generate-ideas`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ topic }),
		});
		const data = await response.json();

		if (response.ok) {
			try {
				// const parsed = JSON.parse(data);
				// console.log(typeof parsed);
				titleSuggestions.innerHTML = "";
				data.ideas.forEach((idea) => {
					const button = document.createElement("button");
					button.type = "button";
					button.textContent = idea;
					button.className =
						"w-full text-left p-2 bg-gray-200 hover:bg-blue-200 rounded-md transition text-sm";
					button.onclick = () => {
						document.getElementById("blog-title").value = idea;
						titleSuggestions.innerHTML = "";
					};
					titleSuggestions.appendChild(button);
					aiTopicInput.value = "";
				});
			} catch (e) {
				console.error("Failed to parse title suggestions:", e);
				alert("The AI returned an unexpected format for titles.");
			}
		}
	} catch (e) {
		setError(
			"Network error or server unreachable. Is the Node.js API running?"
		);
		console.error("Error generating ideas:", e);
	} finally {
		aiLoader.classList.add("hidden");
		[generateTitlesBtn, generatePostBtn].forEach(
			(btn) => (btn.disabled = false)
		);
	}
});

// --- Display Functions ---

function displayIdeas(ideas) {
	ideaList.innerHTML = ""; // Clear previous ideas
	if (ideas && ideas.length > 0) {
		ideas.forEach((idea, index) => {
			const ideaItem = document.createElement("button");
			ideaItem.className =
				"idea-item w-full text-left px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed text-slate-200";
			ideaItem.textContent = idea;
			ideaItem.onclick = () => selectIdeaAsTopic(idea);
			ideaItem.disabled = isLoading; // Disable if loading another task
			ideaList.appendChild(ideaItem);
		});
		ideaListContainer.classList.remove("hidden");
		welcomeMessage.classList.add("hidden"); // Hide welcome
	} else {
		ideaListContainer.classList.add("hidden");
		welcomeMessage.classList.remove("hidden"); // Show welcome if no ideas
	}
}

function displayBlogPost(content) {
	if (content) {
		// For a robust markdown display, you'd integrate a markdown parser library
		// For simplicity, we're just setting innerHTML, which might not render all markdown perfectly
		// A better approach would be to use a library like 'marked.js' or 'dompurify'
		blogDisplayContainer.innerHTML = content;
		blogDisplayContainer.classList.remove("hidden");
		welcomeMessage.classList.add("hidden");
	} else {
		blogDisplayContainer.classList.add("hidden");
		welcomeMessage.classList.remove("hidden");
	}
}

// simple fuction to convert markdown to HTML
function simpleMarkdownToHtml(markdown) {
	if (!markdown) return "";
	return markdown
		.replace(/^### (.*$)/gim, "<h3>$1</h3>")
		.replace(/^## (.*$)/gim, "<h2>$1</h2>")
		.replace(/^# (.*$)/gim, "<h1>$1</h1>")
		.replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
		.replace(/\*(.*?)\*/gim, "<em>$1</em>")
		.replace(/^\s*\n\*/gm, "<ul>\n*")
		.replace(/^(\*.+)\s*\n([^*])/gm, "$1\n</ul>\n$2")
		.replace(/^\* (.*$)/gim, "<li>$1</li>")
		.replace(/\n/g, "<br />");
}

// ai generate blog
generatePostBtn.addEventListener("click", async () => {
	const topic = blogTopicInput.value.trim();
	const token = localStorage.getItem("token");
	if (!topic) {
		alert("Please select or enter a topic first.");
		return;
	}
	aiLoader.classList.remove("hidden");
	[generateTitlesBtn, generatePostBtn].forEach((btn) => (btn.disabled = true));
	// clearContent();
	// setLoading("POST", "Writing your masterpiece...");
	try {
		const response = await fetch(`${API_BASE_URL}/write-post`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ topic }),
		});
		const data = await response.json();

		if (response.ok) {
			quill.clipboard.dangerouslyPasteHTML(0, simpleMarkdownToHtml(data.post));
		} else {
			setError(data.error || "Failed to write blog post.");
		}
	} catch (e) {
		setError(
			"Network error or server unreachable. Is the Node.js API running?"
		);
		console.error("Error writing post:", e);
	} finally {
		aiLoader.classList.add("hidden");
		[generateTitlesBtn, generatePostBtn].forEach(
			(btn) => (btn.disabled = false)
		);
	}
});

function displayImage(imageUrl) {
	if (imageUrl) {
		generatedImageElem.src = imageUrl;
		imageDisplayContainer.classList.remove("hidden");
		welcomeMessage.classList.add("hidden");
	} else {
		imageDisplayContainer.classList.add("hidden");
		welcomeMessage.classList.remove("hidden");
	}
}

// --- Other Logic ---

function selectIdeaAsTopic(idea) {
	topicInput.value = idea;
	clearContent(); // Clear existing results when a new topic is selected
}

// Initial state on load
document.addEventListener("DOMContentLoaded", () => {
	// clearLoading(); // Ensure buttons are enabled initially
	welcomeMessage.classList.remove("hidden"); // Ensure welcome message is visible
});
