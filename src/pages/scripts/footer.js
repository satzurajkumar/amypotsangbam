document.addEventListener("DOMContentLoaded", () => {
	// --- HTML for the Navbar ---
	// The HTML structure is stored in a template literal for easy maintenance.
	const footerHTML = `
         <div class="container mx-auto px-6 py-16">
				<div class="grid md:grid-cols-4 gap-8 text-center md:text-left">
					<div>
						<h4 class="text-white font-bold tracking-wider mb-4">START HERE</h4>
						<ul>
							<li class="mb-2">
								<a href="resources.html" class="hover:text-white">Free Resources</a>
							</li>
							<li class="mb-2">
								<a href="blogs.html" class="hover:text-white">Blogs</a>
							</li>
							<li class="mb-2">
								<a href="#" class="hover:text-white">My Story</a>
							</li>
						</ul>
					</div>
					<div>
						<h4 class="text-white font-bold tracking-wider mb-4">
							QUICK LINKS
						</h4>
						<ul>
							<li class="mb-2">
								<a href="#" class="hover:text-white hover:opacity-100"
									>Courses</a
								>
							</li>
							<li class="mb-2">
								<a href="contact.html" class="hover:text-white hover:opacity-100"
									>Contact</a
								>
							</li>
							<li class="mb-2">
								<a href="#" class="hover:text-white hover:opacity-100"
									>Speaking</a
								>
							</li>
						</ul>
					</div>
					<div>
						<h4 class="text-white font-bold tracking-wider mb-4">LEGAL</h4>
						<ul>
							<li class="mb-2">
								<a href="privacy.html" class="hover:text-white hover:opacity-100"
									>Privacy Policy</a
								>
							</li>
							<li class="mb-2">
								<a href="tnc.html" class="hover:text-white hover:opacity-100"
									>Terms & Conditions</a
								>
							</li>
						</ul>
					</div>
					<div>
						<h4 class="text-white font-bold tracking-wider mb-4">CONNECT</h4>
						<p class="mb-4 hover:text-white">contact@amypotsangbam.com</p>
						<!-- Replace with actual icons -->
						<div class="flex flex-row space-x-4 justify-center md:justify-start">
							<div  id="instagramIcon"></div>
							<div  id="twitterIcon"><a href="https://www.x.com">X</a></div>
							<div id="linkedInIcon"><a href="https://www.linkedin.com">ln</a></div>
						</div>
					</div>
				</div>
				<div
					class="text-center border-t border-white border-opacity-20 mt-12 pt-8"
				>
					<p class="opacity-80 text-sm">
						&copy; <span id="crYear"></span>
						<span class="text-white font-bold">Amy Potsangbam</span> All Rights
						Reserved.
					</p>
				</div>
			</div>
    
    `;

	/**
	 * Injects the navbar HTML into a placeholder element and sets up event listeners.
	 */
	function injectFooter() {
		const placeholder = document.getElementById("footer");

		placeholder.className += "gradient-bg text-gray-300 py-12";
		if (!placeholder) {
			console.error('Footer placeholder with id "footer" not found.');
			return;
		}

		// Inject the HTML
		placeholder.innerHTML = footerHTML;
	}

	// Call the function to inject the navbar when the page loads
	injectFooter();
	const instagramIcon = document.getElementById("instagramIcon");
	const twitterIcon = document.getElementById("twitterIcon");
	const linkedInIcon = document.getElementById("linkedInIcon");

	const instaLink = document.createElement("a");
	instaLink.setAttribute("href", "https://www.instagram.com/amy_potsangbam");
	const instaIcon = document.createElement("i");
	instaIcon.classList.add("fa-brands", "fa-instagram");
	instaLink.appendChild(instaIcon);
	instagramIcon.appendChild(instaLink);
});
