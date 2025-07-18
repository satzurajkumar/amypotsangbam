document.addEventListener("DOMContentLoaded", () => {
	const API_URL = "https://amy-s-blog-backend.onrender.com/api/gallery";

	const imageGrid = document.getElementById("image-grid");
	const fullscreenOverlay = document.getElementById("fullscreen-overlay");
	const fullscreenImage = document.getElementById("fullscreen-image");
	const errorMessageContainer = document.getElementById("error-message");

	let allImageData = []; // We'll still accumulate data here, but fetch it page by page
	let currentPage = 1; // Start with the first page
	const imagesPerPage = 12; // Matches your backend's default limit
	let totalItems = 0; // To store the total number of items from the backend
	let totalPages = 0; // To store the total number of pages from the backend
	let isLoading = false; // Flag to prevent multiple simultaneous fetch requests

	let lazyLoadObserver; // Declare the observer globally

	async function initializeGallery() {
		if (isLoading) return; // Prevent multiple calls
		isLoading = true;

		try {
			// Fetch the first page (or initial batch)
			const response = await fetch(
				`${API_URL}?page=${currentPage}&limit=${imagesPerPage}`
			);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const result = await response.json(); // Backend sends { data, pagination }

			const imageData = result.data;
			totalItems = result.pagination.totalItems;
			totalPages = result.pagination.totalPages;

			if (!imageData || imageData.length === 0) {
				if (currentPage === 1) {
					// Only show empty message if no data on first load
					imageGrid.innerHTML =
						'<p class="text-center col-span-full">The gallery is currently empty.</p>';
				}
				isLoading = false;
				return;
			}

			// Clear loading skeletons only on the very first load
			if (currentPage === 1) {
				imageGrid.innerHTML = "";
				allImageData = []; // Clear previous data if re-initializing
			}

			// Append new data to the accumulated list
			allImageData = allImageData.concat(imageData);

			// --- DYNAMICALLY CREATE GRID ITEMS ---
			// Determine how many items to load immediately (if this is the first page)
			// We want to load slightly more than fits the screen initially.
			// For example, if 6 fit, load 9. Given your backend sends 12 per page,
			// we can just render the first 12 directly.
			// If your 'initial visible count' is less than 'imagesPerPage',
			// you'd need to selectively render with 'true' and 'false' for 'loadImmediately'.
			// For simplicity with your backend's 12-item page, we'll render all received items.

			imageData.forEach((itemData) => {
				// For the first page, we load all images in the first fetch immediately.
				// For subsequent pages fetched by scrolling, they will also be loaded immediately
				// as they are fetched only when needed.
				createGalleryItem(itemData, true);
			});

			// Increment current page for the next fetch
			currentPage++;

			// Setup IntersectionObserver for the "load more" sentinel if there are more pages
			if (currentPage <= totalPages) {
				setupLazyLoadingObserver();
			} else {
				// If all pages are loaded, disconnect the observer
				if (lazyLoadObserver) {
					lazyLoadObserver.disconnect();
					lazyLoadObserver = null;
				}
			}
		} catch (error) {
			console.error("Error fetching gallery data:", error);
			if (currentPage === 1) {
				// Only show error message on first load failure
				imageGrid.innerHTML = ""; // Clear loading skeletons on error
				errorMessageContainer.classList.remove("hidden");
				errorMessageContainer.textContent =
					"Could not load the gallery. Please ensure the backend server is running.";
			}
		} finally {
			isLoading = false;
		}
	}

	/**
	 * Creates and appends a gallery item to the imageGrid.
	 * With paginated fetching, all images received in a response are intended to be displayed.
	 * The 'loadImmediately' parameter isn't as critical for images from subsequent API calls,
	 * as they are fetched precisely because they are needed. However, we keep the data-src for safety.
	 * @param {object} imageData - The data for the image (url, public_id).
	 * @param {boolean} loadImmediately - If true, the image src is set directly.
	 */
	function createGalleryItem(imageData, loadImmediately = true) {
		// Default to true now
		const item = document.createElement("div");
		item.className =
			"gallery-item bg-gray-200 rounded-lg overflow-hidden shadow-sm h-48";
		const imgSrc = loadImmediately ? imageData.url : "";
		const dataSrc = loadImmediately ? "" : `data-src="${imageData.url}"`;

		item.innerHTML = `
        <img ${dataSrc} src="${imgSrc}" alt="${imageData.public_id}" class="${
			loadImmediately ? "" : "lazyload"
		} w-full h-full object-cover">
    `;
		imageGrid.appendChild(item);
		setTimeout(() => {
			item.classList.add("is-visible");
		}, 50);

		// If for some reason we decide to truly lazyload, observe it
		if (!loadImmediately && lazyLoadObserver) {
			lazyLoadObserver.observe(item.querySelector("img"));
		}
	}

	/**
	 * Sets up the IntersectionObserver to detect when to load the next page.
	 * We'll observe a "sentinel" element at the bottom of the current content.
	 */
	function setupLazyLoadingObserver() {
		// If an observer already exists, disconnect it to avoid multiple observers
		if (lazyLoadObserver) {
			lazyLoadObserver.disconnect();
		}

		// Create a sentinel element to observe at the end of the current content
		// This makes it easier to observe "the end of the list" rather than the last image.
		let sentinel = document.getElementById("lazy-load-sentinel");
		if (!sentinel) {
			sentinel = document.createElement("div");
			sentinel.id = "lazy-load-sentinel";
			sentinel.style.height = "1px"; // Make it very small, just a trigger point
			sentinel.style.width = "100%";
			imageGrid.appendChild(sentinel);
		}

		lazyLoadObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !isLoading && currentPage <= totalPages) {
						// Unobserve the current sentinel to prevent multiple triggers
						lazyLoadObserver.unobserve(entry.target);
						// Load the next set of images (next page)
						initializeGallery(); // Call initializeGallery again to fetch next page
					}
				});
			},
			{ rootMargin: "0px 0px 300px 0px" } // Trigger fetch when 300px from bottom of viewport
		);

		lazyLoadObserver.observe(sentinel);
	}

	// --- FULLSCREEN MODAL LOGIC (remains unchanged) ---
	imageGrid.addEventListener("click", (e) => {
		if (e.target.tagName === "IMG" && e.target.src) {
			// Check if image has a src
			fullscreenImage.src = e.target.src;
			fullscreenOverlay.classList.add("active");
		}
	});

	fullscreenOverlay.addEventListener("click", (e) => {
		if (e.target.id === "fullscreen-overlay") {
			fullscreenOverlay.classList.remove("active");
		}
	});
	// --- INITIALIZE ---
	initializeGallery();
});
