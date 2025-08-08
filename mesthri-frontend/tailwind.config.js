/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        rainbow: "linear-gradient(135deg, #ff7e5f, #feb47b, #86a8e7, #91eae4)",
      },
    },
  },
  plugins: [],
}
