module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Brand palette. Teal leads: it is the identity colour across the site,
      // the apps and the bot's guide. Deep blue is kept for depth -- shadows,
      // gradient anchors -- rather than as the anchor colour, and coral is the
      // emphasis colour for expenses and alerts. See
      // docs/brand_visual_language.md in the web repo.
      colors: {
        primary: '#08D2B5',
        secondary: '#08867F',
        accent: '#E1644C',
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
