document.addEventListener("DOMContentLoaded", () => {
	const animatedElements = document.querySelectorAll(".animate-on-scroll");

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("is-visible");
				}
			});
		},
		{
			threshold: 0.1, // Trigger when 10% of the element is visible
		}
	);

	animatedElements.forEach((el) => {
		observer.observe(el);
	});
});
