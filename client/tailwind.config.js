module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, 
  theme: {
    extend: {
      backgroundImage: {
       'hero-pattern': "url('img/hero-pattern.jpg')",
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}