document.addEventListener("DOMContentLoaded", () => {
	// Client-side message box functionality (copied from mega-router-code)
	function showMessage(message, type = "success") {
		let msgBox = document.getElementById("message-box");
		if (!msgBox) {
			// Fallback if message-box div is not found (though it's now in HTML)
			msgBox = document.createElement("div");
			msgBox.id = "message-box";
			msgBox.classList.add(
				"fixed",
				"top-4",
				"right-4",
				"z-50",
				"p-4",
				"rounded-lg",
				"shadow-lg",
				"text-white"
			);
			document.body.appendChild(msgBox);
		}
		msgBox.textContent = message;
		msgBox.classList.remove("hidden", "bg-green-500", "bg-red-500"); // Reset classes
		if (type === "success") {
			msgBox.classList.add("bg-green-500", "block");
		} else {
			msgBox.classList.add("bg-red-500", "block");
		}
		setTimeout(() => msgBox.classList.add("hidden"), 5000); // Hide after 5 seconds
	}

	// Example of how to use showMessage (you to integrate this with the form submission logic)
	// If you submit the form using fetch, you can call showMessage based on the response.
	const contactForm = document.querySelector('form[action="#"]');
	if (contactForm) {
		contactForm.addEventListener("submit", (e) => {
			e.preventDefault();
			// Simulate form submission success/failure
			const success = Math.random() > 0.5; // Randomly succeed or fail
			if (success) {
				showMessage("Message sent successfully!", "success");
				contactForm.reset(); // Clear form on success
			} else {
				showMessage("Failed to send message. Please try again.", "error");
			}
		});
	}
});
