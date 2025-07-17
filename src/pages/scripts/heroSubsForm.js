// This script handles the visibility of the disclaimer text based on email input focus.
document.addEventListener("DOMContentLoaded", () => {
	// Get references to the email input and the disclaimer paragraph by their IDs.
	const emailInput = document.getElementById("emailInput");
	const disclaimerText = document.getElementById("disclaimerText");

	// Ensure both elements exist before adding event listeners.
	if (emailInput && disclaimerText) {
		// Add an event listener for when the email input gains focus.
		emailInput.addEventListener("focus", () => {
			// When focused, remove the 'hidden' class and add 'block' to make it visible.
			disclaimerText.classList.remove("hidden");
			disclaimerText.classList.add("block");
		});

		// Add an event listener for when the email input loses focus.
		emailInput.addEventListener("blur", () => {
			// When blurred, remove 'block' and add 'hidden' to hide it again.
			disclaimerText.classList.remove("block");
			disclaimerText.classList.add("hidden");
		});
	}
});
