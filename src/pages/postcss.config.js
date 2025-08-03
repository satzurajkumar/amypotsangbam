// postcss.config.js
module.exports = {
	plugins: {
		tailwindcss: {},
		autoprefixer: {}, // Optional, but often used with Tailwind
		...(process.env.NODE_ENV === "production" ? { cssnano: {} } : {}),
	},
};
