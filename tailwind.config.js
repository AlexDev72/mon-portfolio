// tailwind.config.js
module.exports = {
  darkMode: 'class', // ← Clé pour le toggle manuel
  content: [
    "./**/*.{html,js}", // Adaptez selon votre structure
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6', // ou une autre couleur
      },
    },
  },
  plugins: [],
}