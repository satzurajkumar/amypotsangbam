document.addEventListener("DOMContentLoaded", () => {
	const API_URL = "https://amy-s-blog-backend.onrender.com/api";

	// --- DOM Elements ---
	const loginScreen = document.getElementById("login-screen");
	const dashboardUI = document.getElementById("dashboard-ui");
	const loginForm = document.getElementById("login-form");
	const logoutButton = document.getElementById("logout-button");
	const mobileMenuButton = document.getElementById("mobile-menu-button");
	const sidebar = document.getElementById("sidebar");
	const overlay = document.getElementById("overlay");
	let visitorsChart;
	let quill;

	// --- API Helper ---
	const api = {
		async request(method, endpoint, body = null, isFormData = false) {
			const headers = { Authorization: `Bearer ${auth.token}` };
			// Only add the Authorization header if a token exists.
			// if (auth.token) {
			// 	headers["Authorization"] = `Bearer ${auth.token}`;
			// }
			if (body && !isFormData) {
				headers["Content-Type"] = "application/json";
			}
			const config = {
				method,
				headers,
				body: isFormData ? body : body ? JSON.stringify(body) : null,
			};
			try {
				const response = await fetch(`${API_URL}${endpoint}`, config);
				const responseData =
					response.status !== 204 ? await response.json() : null;
				return {
					ok: response.ok,
					status: response.status,
					data: responseData,
				};
			} catch (error) {
				console.error("API request error:", error);
				return {
					ok: false,
					status: 500,
					data: { msg: "Network error or server is unreachable." },
				};
			}
		},
		get(endpoint) {
			return this.request("GET", endpoint);
		},
		post(endpoint, body) {
			return this.request("POST", endpoint, body);
		},
		postForm(endpoint, formData) {
			return this.request("POST", endpoint, formData, true);
		},
		put(endpoint, body) {
			return this.request("PUT", endpoint, body);
		},
		del(endpoint) {
			return this.request("DELETE", endpoint);
		},
	};

	// --- Authentication ---
	const auth = {
		token: localStorage.getItem("token"),
		async login(username, password) {
			const loginButton = document.getElementById("login-button");
			const loginError = document.getElementById("login-error");
			loginButton.disabled = true;
			loginButton.textContent = "Logging in...";
			loginError.textContent = "";

			// Use the consistent API helper for login
			const response = await api.post("/auth/login", {
				username,
				password,
			});

			if (response.ok && response.data.token) {
				this.token = response.data.token;
				localStorage.setItem("token", this.token);
				this.showDashboard();
			} else {
				loginError.textContent =
					response.data.msg || `Error: ${response.status}`;
			}
			loginButton.disabled = false;
			loginButton.textContent = "Login";
		},
		logout() {
			this.token = null;
			localStorage.removeItem("token");
			loginScreen.style.display = "flex";
			dashboardUI.style.display = "none";
			sidebar.classList.remove("open");
			overlay.classList.remove("active");
		},
		showDashboard() {
			loginScreen.style.display = "none";
			dashboardUI.style.display = "block";
			initDashboard();
		},
		check() {
			if (this.token) this.showDashboard();
		},
	};

	loginForm.addEventListener("submit", (e) => {
		e.preventDefault();
		auth.login(
			document.getElementById("username").value,
			document.getElementById("password").value
		);
	});
	logoutButton.addEventListener("click", () => auth.logout());

	// --- Mobile Menu Toggle Logic ---
	const toggleSidebar = () => {
		sidebar.classList.toggle("open");
		overlay.classList.toggle("active");
	};
	mobileMenuButton.addEventListener("click", toggleSidebar);
	overlay.addEventListener("click", toggleSidebar);

	// --- Dashboard Initialization ---
	const initDashboard = () => {
		initializeQuillEditor();
		loadAnalytics();
		loadBlogPosts();
		loadMediaGallery();
		setupNavigation();
		setupBlogForm();
		setupMediaForm();
		setupImageUploadArea();
	};

	const initializeQuillEditor = () => {
		quill = new Quill("#editor-container", {
			theme: "snow",
			modules: {
				toolbar: [
					[{ header: [1, 2, 3, false] }],
					["bold", "italic", "underline"],
					[{ list: "ordered" }, { list: "bullet" }],
					["link"],
					["clean"],
				],
			},
			placeholder: "Start writing...",
		});
	};

	const loadAnalytics = async () => {
		const response = await api.get("/analytics/visitors");
		if (!response.ok) return;
		const data = response.data;
		if (visitorsChart) visitorsChart.destroy();
		const ctx = document.getElementById("visitorsChart").getContext("2d");
		visitorsChart = new Chart(ctx, {
			type: "line",
			data: {
				labels: data.labels,
				datasets: [
					{
						label: "Unique Visitors",
						data: data.data,
						borderColor: "#3b82f6",
						tension: 0.1,
					},
				],
			},
		});
	};

	// --- Blog Management (Full implementation restored) ---
	const blogList = document.getElementById("blog-list");
	const blogForm = document.getElementById("blog-form");
	const blogFormTitle = document.getElementById("blog-form-title");
	const blogSubmitButton = document.getElementById("blog-submit-button");
	const blogCancelButton = document.getElementById("blog-cancel-button");
	const blogIdInput = document.getElementById("blog-id");
	const blogTitleInput = document.getElementById("blog-title");

	const loadBlogPosts = async () => {
		const response = await api.get("/blogs");
		if (!response.ok) {
			blogList.innerHTML = `<tr><td colspan="3" class="p-2 text-red-500">Could not load blog posts.</td></tr>`;
			return;
		}
		const posts = response.data;
		blogList.innerHTML = "";
		posts.forEach((post) => {
			const row = document.createElement("tr");
			row.innerHTML = `<td class="p-2 border-b">${
				post.title
			}</td><td class="p-2 border-b hidden sm:table-cell">${new Date(
				post.created_at
			).toLocaleDateString()}</td><td class="p-2 border-b"><button data-id="${
				post.id
			}" class="edit-post-btn text-blue-500 hover:underline mr-2">Edit</button><button data-id="${
				post.id
			}" class="delete-post-btn text-red-500 hover:underline">Delete</button></td>`;
			blogList.appendChild(row);
		});
	};

	const setupBlogForm = () => {
		blogForm.addEventListener("submit", async (e) => {
			e.preventDefault();
			const id = blogIdInput.value;
			const title = blogTitleInput.value;
			const content = quill.root.innerHTML;
			const isUpdating = !!id;
			const response = isUpdating
				? await api.put(`/blogs/${id}`, { title, content })
				: await api.post("/blogs", { title, content });
			if (response.ok) {
				resetBlogForm();
				loadBlogPosts();
			} else {
				alert(`Error: ${response.data.msg || "Failed to save post."}`);
			}
		});
		blogCancelButton.addEventListener("click", resetBlogForm);
	};

	const resetBlogForm = () => {
		blogForm.reset();
		quill.root.innerHTML = "";
		blogIdInput.value = "";
		blogFormTitle.textContent = "Write a New Blog Post";
		blogSubmitButton.textContent = "Publish Post";
		blogCancelButton.classList.add("hidden");
	};

	blogList.addEventListener("click", async (e) => {
		const target = e.target;
		const id = target.dataset.id;
		if (target.classList.contains("delete-post-btn")) {
			if (confirm("Are you sure?")) {
				await api.del(`/blogs/${id}`);
				loadBlogPosts();
			}
		} else if (target.classList.contains("edit-post-btn")) {
			const response = await api.get(`/blogs/${id}`);
			if (response.ok) {
				const post = response.data;
				blogIdInput.value = post.id;
				blogTitleInput.value = post.title;
				quill.root.innerHTML = post.content;
				blogFormTitle.textContent = "Edit Blog Post";
				blogSubmitButton.textContent = "Update Post";
				blogCancelButton.classList.remove("hidden");
				blogForm.scrollIntoView({ behavior: "smooth" });
			}
		}
	});

	// --- Media Management ---
	const mediaGrid = document.getElementById("media-grid");
	const imageUploadForm = document.getElementById("imageUploadForm");

	const loadMediaGallery = async () => {
		const response = await api.get("/gallery?limit=100");
		if (!response.ok) {
			mediaGrid.innerHTML = `<p class="col-span-full text-red-500">Could not load media. ${
				response.data.msg || ""
			}</p>`;
			return;
		}
		const images = response.data.data;
		mediaGrid.innerHTML = "";
		if (!images || images.length === 0) {
			mediaGrid.innerHTML = `<p class="col-span-full text-gray-500">No media uploaded yet.</p>`;
		} else {
			images.forEach((image) => {
				const thumbnailUrl = image.url.replace(
					"/upload/",
					"/upload/c_thumb,w_200,h_200,g_face/"
				);
				const item = document.createElement("div");
				item.className =
					"relative group bg-white rounded-lg shadow-sm overflow-hidden";
				item.innerHTML = `<img src="${thumbnailUrl}" alt="${image.public_id}" class="w-full h-32 object-cover"><div class="p-2"><p class="text-xs text-gray-600 truncate" title="${image.public_id}">${image.public_id}</p></div><div class="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><button data-public-id="${image.public_id}" class="delete-media-btn bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700">Delete</button></div>`;
				mediaGrid.appendChild(item);
			});
		}
	};

	// NEW/UPDATED ELEMENTS FOR IMAGE PREVIEW & D&D
	const imageFileInput = document.getElementById("imageFileInput");
	const imagePreviewContainer = document.getElementById(
		"imagePreviewContainer"
	);
	const imagePreview = document.getElementById("imagePreview");
	const imagePreviewPlaceholder = document.getElementById(
		"imagePreviewPlaceholder"
	);
	const imageFileName = document.getElementById("imageFileName");
	const uploadButton = document.getElementById("upload-button"); // Get reference to the actual button

	const updateImagePreview = (file) => {
		if (file) {
			if (file.type.startsWith("image/")) {
				const reader = new FileReader();

				reader.onload = (e) => {
					imagePreview.src = e.target.result;
					imagePreview.classList.remove("hidden");
					imagePreviewPlaceholder.classList.add("hidden");
					imageFileName.textContent = file.name;
					imageFileName.classList.remove("hidden");
					uploadButton.classList.remove("hidden"); // Show the upload button
				};

				reader.readAsDataURL(file);
			} else {
				// Not an image, clear preview and show placeholder
				imagePreview.src = "#";
				imagePreview.classList.add("hidden");
				imagePreviewPlaceholder.classList.remove("hidden");
				imageFileName.classList.add("hidden");
				imageFileName.textContent = "";
				uploadButton.classList.add("hidden"); // Hide button if not an image
				alert("Please select an image file (e.g., .jpg, .png, .gif).");
				return false; // Indicate failure
			}
		} else {
			// No file (e.g., after successful upload or clear)
			imagePreview.src = "#";
			imagePreview.classList.add("hidden");
			imagePreviewPlaceholder.classList.remove("hidden");
			imageFileName.classList.add("hidden");
			imageFileName.textContent = "";
			uploadButton.classList.add("hidden"); // Hide the upload button
		}
		return true; // Indicate success (file was processed)
	};

	// Function to handle image selection and drag/drop
	const setupImageUploadArea = () => {
		// 1. Handle click on the preview container to open file input
		imagePreviewContainer.addEventListener("click", () => {
			imageFileInput.click(); // Programmatically click the hidden file input
		});

		// 2. Handle file input change (for both click selection and drag/drop)
		imageFileInput.addEventListener("change", (event) => {
			const file = event.target.files[0];
			updateImagePreview(file); // Simply update preview and button visibility
			// NO AUTO-SUBMIT HERE. Submission will happen via the visible uploadButton click.
		});

		// 3. Handle Drag and Drop events
		imagePreviewContainer.addEventListener("dragover", (e) => {
			e.preventDefault(); // Prevent default to allow drop
			imagePreviewContainer.classList.add("border-blue-600", "bg-blue-100"); // Visual feedback
		});

		imagePreviewContainer.addEventListener("dragleave", (e) => {
			e.preventDefault();
			imagePreviewContainer.classList.remove("border-blue-600", "bg-blue-100"); // Remove visual feedback
		});

		imagePreviewContainer.addEventListener("drop", (e) => {
			e.preventDefault();
			imagePreviewContainer.classList.remove("border-blue-600", "bg-blue-100"); // Remove visual feedback

			const files = e.dataTransfer.files; // Get dropped files
			if (files.length > 0) {
				// Assign the dropped file to the hidden file input
				imageFileInput.files = files;
				// Manually trigger the 'change' event on the input
				// so our existing change listener handles the preview and button visibility
				const changeEvent = new Event("change", { bubbles: true });
				imageFileInput.dispatchEvent(changeEvent);
			}
		});
	};

	const setupMediaForm = () => {
		imageUploadForm.addEventListener("submit", async (e) => {
			e.preventDefault(); // Prevent default browser submission

			const file = imageFileInput.files[0];
			if (!file) {
				alert("Please select an image to upload.");
				return;
			}

			uploadButton.disabled = true;
			uploadButton.textContent = "Uploading...";

			const formData = new FormData(imageUploadForm);

			const response = await api.postForm("/gallery/upload", formData);
			if (response.ok) {
				loadMediaGallery();
				updateImagePreview(null); // Clear the preview and hide button
				imageFileInput.value = ""; // Clear the actual file input selection for next upload
			} else {
				alert(`Upload failed: ${response.data.msg || "An error occurred"}`);
			}
			uploadButton.textContent = "Upload";
			uploadButton.disabled = false;
		});
	};
	mediaGrid.addEventListener("click", async (e) => {
		if (e.target.classList.contains("delete-media-btn")) {
			const publicId = e.target.dataset.publicId;
			if (confirm(`Are you sure you want to delete "${publicId}"?`)) {
				const response = await api.del(`/gallery/${publicId}`);
				if (response.ok) {
					loadMediaGallery();
				} else {
					alert(
						`Failed to delete image: ${response.data.msg || "Server error"}`
					);
				}
			}
		}
	});

	// --- Navigation ---
	const setupNavigation = () => {
		const links = document.querySelectorAll(".sidebar-link");
		const panels = document.querySelectorAll(".content-panel");
		const pageTitle = document.getElementById("page-title");
		links.forEach((link) => {
			link.addEventListener("click", (e) => {
				e.preventDefault();
				const targetId = link.getAttribute("href").substring(1) + "-content";
				links.forEach((l) => l.classList.remove("active"));
				link.classList.add("active");
				panels.forEach((p) => p.classList.add("hidden"));
				document.getElementById(targetId).classList.remove("hidden");
				pageTitle.textContent = link.textContent.trim();
				if (sidebar.classList.contains("open")) {
					toggleSidebar();
				}
				if (link.getAttribute("href") === "#portfolio") {
					loadMediaGallery();
				}
			});
		});
	};

	// --- Initial Check ---
	auth.check();
	// auth.showDashboard();
});
