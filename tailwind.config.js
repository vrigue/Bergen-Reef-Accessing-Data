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
        'medium-teal': '#009DA8',
        'dark-teal': '#3B6769',
        'light-orange': '#FCD98C',
        'medium-orange': '#FFCA57',
        'orange': '#FEB934',
        'dark-orange': '#FFA900',
        'light-gray': '#F1F0F0',
        'medium-gray': '#B1B1B4',
        'gray': '#757575',
        'dark-gray': '#5E5E5E'
      },
      dropShadow: {
        'orange': '0 5px 5px #ffb734',
      }
    },
  plugins: [],
  }
}