/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/**/*.{js,ts,jsx,tsx,mdx}', // Note the addition of the `app` directory.
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      'sans': ['"Montserrat"', 'ui-sans-serif', 'system-ui']
    },
    extend: {
      colors: {
        'teal': '#68bfc6',
        'medium-teal': '#009da8',
        'dark-teal': '#3b6769',
        'light-orange': '#fcd98c',
        'medium-orange': '#ffca57',
        'orange': '#ffb734',
        'dark-orange': '#ffa600',
        'light-gray': '#e8e8e8',
        'medium-gray': '#e0e0e0'
      },
    },
  plugins: [],
  }
}