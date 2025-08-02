document.addEventListener("DOMContentLoaded", () => {
	const mobileMenuButton = document.getElementById("mobile-menu-button");
	const closeMenuButton = document.getElementById("close-menu-button");
	const mobileMenu = document.getElementById("mobile-menu");
	const animatedElements = document.querySelectorAll(".animate-on-scroll");

	try {
		// to display current year inside footer section
		const crYear = document.getElementById("crYear");
		const currentDate = new Date();
		const currentYear = currentDate.getFullYear();
		crYear.innerText = currentYear;
	} catch (error) {
		console.log("cannot find the element");
	}

	try {
		// function to ad animation on load
		const observer = new IntersectionObserver(
			(entries, observer) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("is-visible");
						// Optional: stop observing once the element is visible
						observer.unobserve(entry.target);
					}
				});
			},
			{
				threshold: 0.1, // Trigger when 10% of the element is visible
			}
		);

		animatedElements.forEach((element) => {
			observer.observe(element);
		});
	} catch (error) {
		console.log(error);
	}

	try {
		// Function to toggle the menu
		const toggleMenu = () => {
			mobileMenu.classList.toggle("hidden");
		};
	} catch (error) {
		console.log(error);
	}

	try {
		// Event listeners for mobile menu
		mobileMenuButton.addEventListener("click", toggleMenu);
		closeMenuButton.addEventListener("click", toggleMenu);
	} catch (error) {
		console.log("cannot get element toggleMenu");
	}

	/**
	 * -------------------------------------------
	 * VISITOR TRACKING SCRIPT
	 * This script gathers visitor data and sends it to the backend.
	 * -------------------------------------------
	 */
	const trackVisitor = async () => {
		try {
			// Generate or retrieve a unique session ID for the user's visit
			let sessionId = sessionStorage.getItem("sessionId");
			if (!sessionId) {
				sessionId =
					Date.now().toString(36) + Math.random().toString(36).substring(2);
				sessionStorage.setItem("sessionId", sessionId);
			}

			// Gather all data points required by the backend table
			const visitorData = {
				sessionId: sessionId,
				url: window.location.href,
				pageTitle: document.title,
				referrer: document.referrer || "Direct",
				screenWidth: window.screen.width,
				screenHeight: window.screen.height,
				language: navigator.language,
				userAgent: navigator.userAgent,
			};

			// IMPORTANT!!
			const BACKEND_HOST =
				window.location.hostname === "127.0.0.1"
					? "http://localhost:3000"
					: "https://amy-s-blog-backend.onrender.com";

			const backendUrl = `${BACKEND_HOST}/api/track`;

			// Send the data to the backend
			await fetch(backendUrl, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(visitorData),
			});
		} catch (error) {
			// We don't want to interrupt the user experience if tracking fails,
			// so we just log the error to the console for debugging.
			console.error("Error tracking visitor:", error);
		}
	};

	// Call the tracking function on page load
	trackVisitor();
});
