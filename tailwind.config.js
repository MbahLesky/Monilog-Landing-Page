module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Brand palette from docs/brand_visual_language.md (Monilog - Web), which
      // names the Flutter app's app_theme.dart as the source of truth: blue is
      // the anchor, teal the positive/supporting colour, coral the emphasis.
      // This site is dark throughout, so primary/secondary/accent carry the
      // softened dark-theme values the doc asks for ("softened blue, teal, and
      // coral accents rather than harsh neon") -- the same ones the app uses in
      // dark mode. The deep light-theme values stay available for surfaces,
      // gradients and shadows.
      colors: {
        primary: '#8DB4FF',
        secondary: '#67D3C7',
        accent: '#FF8F78',
        deepblue: '#173B7A',
        deepteal: '#0F8C83',
        deepcoral: '#E1644C'
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
