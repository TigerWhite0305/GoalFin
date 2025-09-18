module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class', // Assicurati che questo ci sia
  theme: {
    extend: {},
  },
  plugins: [
    // Plugin per supportare .light
    function({ addVariant }) {
      addVariant('light', '.light &')
    }
  ],
}