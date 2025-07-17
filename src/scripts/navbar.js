document.addEventListener("DOMContentLoaded", () => {
	// --- HTML for the Navbar ---
	// The HTML structure is stored in a template literal for easy maintenance.
	const navbarHTML = `
            <div class="container mx-auto px-6">
                <div class="flex justify-between items-center h-20">
                    <!-- Logo -->
                    <a href="../../index.html" class="text-2xl font-serif font-bold text-dark">Amy Potsangbam</a>

                    <!-- Desktop Menu -->
                    <div class="hidden md:flex space-x-8">
                        <a href="blogs.html" id="blogs" class="text-gray-600 hover:text-secondary hover:font-semibold">Blogs</a>
                        <a href="resources.html" id="resources" class="text-gray-600 hover:text-secondary hover:font-semibold">Resources</a>
                        <a href="about.html" id="about" class="text-gray-600 hover:text-secondary hover:font-semibold">About me</a>
                        <a href="gallery.html" id="gallery" class="text-gray-600 hover:text-secondary hover:font-semibold">My Gallery</a>
                        <a href="contact.html"id="contact" class="text-gray-600 hover:text-secondary hover:font-semibold">Contacts</a>
                    </div>

                    <!-- Mobile Menu Button -->
                    <div class="md:hidden">
                        <button id="mobile-menu-button" class="text-dark focus:outline-none">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Mobile Menu -->
            <div id="mobile-menu" class="hidden md:hidden">
                <div class="absolute top-0 left-0 w-full h-screen bg-white flex flex-col items-center justify-center">
                    <button id="close-menu-button" class="absolute top-7 right-6 text-dark focus:outline-none">
                        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                    <a href="blogs.html" id="blogs" class="block text-2xl py-4 text-gray-600 hover:text-secondary">Blogs</a>
                    <a href="resources.html" id="resources" class="block text-2xl py-4 text-gray-600 hover:text-secondary">Resources</a>
                    <a href="about.html" id="about" class="block text-2xl py-4 text-gray-600 hover:text-secondary">About me</a>
                    <a href="gallery.html" id="gallery" class="block text-2xl py-4 text-gray-600 hover:text-secondary">My Gallery</a>
                    <a href="contact.html" id="contact" class="block text-2xl py-4 text-gray-600 hover:text-secondary">Contacts</a>
                </div>
            </div>
    
    `;

	/**
	 * Injects the navbar HTML into a placeholder element and sets up event listeners.
	 */
	function injectNavbar() {
		const placeholder = document.getElementById("navbar");
		const referredFrom = placeholder.dataset.refer;

		placeholder.className +=
			"fixed top-0 left-0 w-full bg-white shadow-md z-50";
		if (!placeholder) {
			console.error('Navbar placeholder with id "navbar" not found.');
			return;
		}

		// Inject the HTML
		placeholder.innerHTML = navbarHTML;

		// --- Setup Event Listeners for the Mobile Menu ---
		const mobileMenuButton = document.getElementById("mobile-menu-button");
		const closeMenuButton = document.getElementById("close-menu-button");
		const mobileMenu = document.getElementById("mobile-menu");

		if (mobileMenuButton && closeMenuButton && mobileMenu) {
			const toggleMenu = () => {
				mobileMenu.classList.toggle("hidden");
			};

			mobileMenuButton.addEventListener("click", toggleMenu);
			closeMenuButton.addEventListener("click", toggleMenu);
		}

		switch (referredFrom) {
			case "about":
				{
					const element = document.getElementById("about");
					element.className = "text-secondary font-semibold";
				}
				break;
			case "blogs":
				{
					const element = document.getElementById("blogs");
					element.className = "text-secondary font-semibold";
				}
				break;
			case "gallery":
				{
					const element = document.getElementById("gallery");
					element.className = "text-secondary font-semibold";
				}
				break;
			case "contact":
				{
					const element = document.getElementById("contact");
					element.className = "text-secondary font-semibold";
				}
				break;
			case "resources":
				{
					const element = document.getElementById("resources");
					element.className = "text-secondary font-semibold";
				}
				break;
			default:
		}
	}

	// Call the function to inject the navbar when the page loads
	injectNavbar();
});
