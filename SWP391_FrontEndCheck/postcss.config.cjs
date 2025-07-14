// postcss.config.cjs
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {}, // ← was `tailwindcss: {}`
    autoprefixer: {},
  },
};
