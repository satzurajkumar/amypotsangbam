document.addEventListener("DOMContentLoaded", () => {
	const API_URL = "https://amy-s-blog-backend.onrender.com/api";

	const newsletterForm = document.querySelector("form.w-full");
	const emailInput = document.getElementById("emailInput");

	// Modal Elements

	const customModalOverlay = document.getElementById("customModalOverlay");
	const customModalContent = document.getElementById("customModalContent");
	const modalCloseBtn = document.getElementById("modalCloseBtn");
	const modalOkBtn = document.getElementById("modalOkBtn");
	const modalHeader = document.getElementById("modalHeader");
	const modalMessage = document.getElementById("modalMessage");

	function showModal(header, message, type = "info") {
		modalHeader.textContent = header;
		modalMessage.textContent = message;

		customModalContent.classList.remove("modal-success", "modal-error");
		if (type === "success") {
			customModalContent.classList.add("modal-success");
		} else if (type === "error") {
			customModalContent.classList.add("modal-error");
		}

		customModalOverlay.classList.remove("hidden");
		customModalContent.classList.remove("hidden");
		// Use a timeout to allow the browser to apply the 'display:flex'
		// before adding the 'visible' class for the transition to work.
		setTimeout(() => {
			customModalOverlay.classList.add("visible");
		}, 10);
	}

	function hideModal() {
		customModalOverlay.classList.remove("visible");
		// Wait for the transition to finish before hiding the element
		setTimeout(() => {
			customModalContent.classList.add("hidden");
			customModalOverlay.classList.add("hidden");
		}, 300); // Should match the transition duration
	}

	modalCloseBtn.addEventListener("click", hideModal);
	modalOkBtn.addEventListener("click", hideModal);
	customModalOverlay.addEventListener("click", (e) => {
		if (e.target === customModalOverlay) {
			hideModal();
		}
	});

	newsletterForm.addEventListener("submit", async (e) => {
		e.preventDefault();

		const email = emailInput.value;
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const sanitizedEmail = email.trim().toLowerCase();

		// Client-side validation
		if (!sanitizedEmail) {
			showModal("Validation Error", "Email address cannot be empty.", "error");
			return;
		}
		if (!emailRegex.test(sanitizedEmail)) {
			showModal(
				"Validation Error",
				"Please enter a valid email address.",
				"error"
			);
			return;
		}

		try {
			const response = await fetch(`${API_URL}/newsletter/subscribe`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				// FIX: The key must be "email" to match the backend validator.
				body: JSON.stringify({ email: sanitizedEmail }),
			});

			const data = await response.json();

			if (response.ok) {
				showModal(
					"Success!",
					data.msg || "You have successfully subscribed to the newsletter!",
					"success"
				);
				emailInput.value = "";

				// --- Confetti Effect! ---
				confetti({
					particleCount: 100,
					spread: 70,
					origin: { y: 0.6 },
				});
			} else {
				// Handle server-side errors
				const errorMessage = data.errors
					? data.errors.map((err) => err.msg).join("\n")
					: data.msg;
				showModal(
					"Subscription Failed",
					errorMessage || "An unknown error occurred.",
					"error"
				);
			}
		} catch (error) {
			console.error("Error subscribing:", error);
			showModal(
				"Network Error",
				"An error occurred while trying to subscribe. Please try again later.",
				"error"
			);
		}
	});
});
