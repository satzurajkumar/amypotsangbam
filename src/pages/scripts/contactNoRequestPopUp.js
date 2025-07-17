// Get references to the DOM elements
const requestPhoneNoBtn = document.getElementById("requestPhoneNoBtn");
const contactModal = document.getElementById("contactModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const contactForm = document.getElementById("contactForm");

// Function to show the modal
function showModal() {
	contactModal.classList.add("show");
}

// Function to hide the modal
function hideModal() {
	contactModal.classList.remove("show");
	// Optional: Clear form fields when closing
	contactForm.reset();
}

// Event listener for the "Request Phone No." button click
requestPhoneNoBtn.addEventListener("click", showModal);

// Event listener for the close button inside the modal
closeModalBtn.addEventListener("click", hideModal);

// Event listener to close the modal when clicking outside the content
contactModal.addEventListener("click", (event) => {
	// Check if the click occurred directly on the modal-overlay (not its children)
	if (event.target === contactModal) {
		hideModal();
	}
});

// Event listener for form submission
contactForm.addEventListener("submit", (event) => {
	event.preventDefault(); // Prevent default form submission behavior

	// Get form data
	const name = document.getElementById("name").value;
	const email = document.getElementById("email").value;
	const phone = document.getElementById("phone").value;
	const reason = document.getElementById("reason").value;

	// Log the data to the console (in a real application, you would send this to a server)
	console.log("Form Submitted!");
	console.log("Name:", name);
	console.log("Email:", email);
	console.log("Phone Number:", phone);
	console.log("Reason:", reason);

	// In a real application, you would typically send this data to a backend server here.
	// For this example, we'll just simulate a successful submission and close the modal.

	// Provide user feedback (e.g., a temporary success message)
	// For now, we'll just close the modal and you can see the data in the console.
	hideModal();
	// You could also add a message box here instead of console.log for user feedback
	// For example: alert('Thank you for your request! We will contact you soon.');
});
