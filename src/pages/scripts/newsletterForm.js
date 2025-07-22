// Inside your existing frontend JavaScript
document.addEventListener("DOMContentLoaded", () => {
	const API_URL = "https://amy-s-blog-backend.onrender.com/api";

	const newsletterForm = document.querySelector("form.w-full"); // Select the form
	const emailInput = document.getElementById("emailInput");

	newsletterForm.addEventListener("submit", async (e) => {
		e.preventDefault(); // Prevent default form submission

		const email = emailInput.value;

		try {
			const response = await fetch(`${API_URL}/newsletter/subscribe`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			});

			const data = await response.json();

			if (response.ok) {
				// Success!
				alert(data.msg); // Or display a success message more elegantly
				emailInput.value = ""; // Clear the input field
			} else {
				// Handle errors (e.g., validation errors, duplicate email)
				if (data.errors) {
					// Display validation errors from express-validator
					const errorMessages = data.errors.map((err) => err.msg).join("\n");
					alert(`Subscription failed:\n${errorMessages}`);
				} else {
					alert(
						`Subscription failed: ${data.msg || "An unknown error occurred."}`
					);
				}
			}
		} catch (error) {
			console.error("Error subscribing:", error);
			alert(
				"An error occurred while trying to subscribe. Please try again later."
			);
		}
	});
});
