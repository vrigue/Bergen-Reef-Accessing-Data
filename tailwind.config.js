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
        'light-teal': '#A2D9D9',
        'teal': '#68BFC6',
        'medium-teal': '#58b0b8',
        'dark-teal': '#4f8a8c',
        'light-orange': '#FCD98C',
        'medium-orange': '#FFCA57',
        'orange': '#FEB934',
        'dark-orange': '#FFA900',
        'light-gray': '#F8F8F9',
        'medium-gray': '#B1B1B4',
        'gray': '#757575',
        'dark-gray': '#5E5E5E',
        'blue': '#1f77b4',
        'medium-blue': '#3290D2',
        'light-blue': '#ECF6FF',
        'red-orange': '#ff7f0e',
        'medium-red-orange': '#F78B2C',
        'light-red-orange': '#FBE8D8',
      },
      dropShadow: {
        'orange': '0 5px 5px #ffb734',
      }
    },
  plugins: [],
  }
}