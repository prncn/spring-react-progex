module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, 
  theme: {
    extend: {
      backgroundImage: {
       'post-img': "url('img/flame-1681.png')",
       'hero-pattern': "url('img/hero-pattern.jpg')",
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}