document.addEventListener("DOMContentLoaded", () => {
	const API_URL = "https://amy-s-blog-backend.onrender.com/api/gallery";

	const imageGrid = document.getElementById("image-grid");
	const fullscreenOverlay = document.getElementById("fullscreen-overlay");
	const fullscreenImage = document.getElementById("fullscreen-image");
	const errorMessageContainer = document.getElementById("error-message");

	/**
	 * Main function to initialize the gallery
	 */
	async function initializeGallery() {
		try {
			const response = await fetch(API_URL);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const imageGridData = await response.json();

			if (!imageGridData || imageGridData.length === 0) {
				imageGrid.innerHTML =
					'<p class="text-center col-span-full">The gallery is currently empty.</p>';
				return;
			}

			// Clear loading skeletons
			imageGrid.innerHTML = "";

			// --- DYNAMICALLY CREATE GRID ITEMS ---
			imageGridData.forEach((imageData) => {
				const item = document.createElement("div");
				item.className =
					"gallery-item bg-gray-200 rounded-lg overflow-hidden shadow-sm";
				item.innerHTML = `
                            <img data-src="${imageData.url}" alt="${imageData.public_id}" class="lazyload w-full h-full object-cover">
                        `;
				imageGrid.appendChild(item);
			});

			// --- SETUP LAZY LOADING FOR NEW IMAGES ---
			setupLazyLoading();
		} catch (error) {
			console.error("Error fetching gallery data:", error);
			imageGrid.innerHTML = ""; // Clear loading skeletons on error
			errorMessageContainer.classList.remove("hidden");
			errorMessageContainer.textContent =
				"Could not load the gallery. Please ensure the backend server is running.";
		}
	}

	/**
	 * Sets up the IntersectionObserver for lazy loading images
	 */
	function setupLazyLoading() {
		const lazyImages = document.querySelectorAll(".lazyload");
		const lazyLoadObserver = new IntersectionObserver(
			(entries, observer) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const img = entry.target;
						img.src = img.dataset.src;
						img.classList.remove("lazyload");
						img.parentElement.classList.add("is-visible");
						observer.unobserve(img);
					}
				});
			},
			{ rootMargin: "0px 0px 200px 0px" }
		);

		lazyImages.forEach((img) => lazyLoadObserver.observe(img));
	}

	// --- FULLSCREEN MODAL LOGIC ---
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
