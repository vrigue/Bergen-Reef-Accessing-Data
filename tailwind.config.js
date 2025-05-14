/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/**/*.{js,ts,jsx,tsx,mdx}', // Note the addition of the `app` directory.
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontSize: {
      'xs': '0.75rem',     
      'sm': '0.975rem',    
      'base': '1rem',      
      'lg': '1.125rem',    
      'xl': '1.25rem',     
      '2xl': '1.5rem',     
      '3xl': '1.875rem',  
      '4xl': '2.25rem',    
      '5xl': '2.75rem',    
      '6xl': '3rem',       
    },
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
        'dark-gray': '#5E5E5E'
      },
      dropShadow: {
        'orange': '0 5px 5px #ffb734',
      }
    },
  plugins: [],
  }
}