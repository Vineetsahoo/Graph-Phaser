/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx}', './lib/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Inter"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace']
      },
      colors: {
        swiss: {
          bg: '#FFFFFF',
          fg: '#000000',
          muted: '#F2F2F2',
          accent: '#FF3000',
          border: '#000000'
        }
      }
    }
  },
  plugins: []
};
