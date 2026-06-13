module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#08D2B5',
        secondary: '#08867F',
        deepblue: '#173B7A'
      },
      boxShadow: {
        soft: '0 30px 90px rgba(23, 59, 122, 0.08)'
      },
      borderRadius: {
        xl: '1.25rem'
      }
    }
  },
  plugins: []
};
