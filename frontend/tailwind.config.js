/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontSize: {
        // აქ დავამატე შენი რესპონსივი ზომები
        "responsive-base": [
          "clamp(1rem, 1.2vw, 1.25rem)",
          { lineHeight: "1.5" },
        ],
        "responsive-title": [
          "clamp(1.25rem, 5vw, 3rem)",
          { lineHeight: "1.2" },
        ],
        "responsive-p": ["clamp(0.75rem, 4vw, 2.5rem)", { lineHeight: "1.3" }],
      },
    },
  },
  plugins: [],
};
