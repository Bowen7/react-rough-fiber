/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['[data-theme="dark"]'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './sandboxes/**/*.{js,ts,jsx,tsx}',
    './theme.config.tsx',
  ],
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light', 'dark'],
  },
};
