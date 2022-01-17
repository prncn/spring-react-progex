module.exports = {
  purge: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
    './src/components/*.{js,jsx}',
  ],
  darkMode: false,
  theme: {
    extend: {
      backgroundImage: {
        'post-img': "url('img/flame-1681.png')",
        'hero-pattern': "url('img/hero-pattern.jpg')",
      },
      animation: {
        'gradient-y': 'gradient-y 5s ease infinite',
        'gradient-xy': 'gradient-xy 2s ease infinite',
        'progress': 'progress 5s ease',
      },
      keyframes: {
        'gradient-y': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'center top',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center center',
          },
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        'progress': {
          '0%': {
            'width': '0%',
          },
          '100%': {
            'width': '100%'
          }
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
