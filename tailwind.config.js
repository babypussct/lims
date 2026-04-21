/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  darkMode: 'class',
  theme: { 
    extend: { 
      fontFamily: { 
        sans: ['"Open Sans"', 'sans-serif'],
        display: ['"Inter"', 'sans-serif'],
      }, 
      colors: { 
        gray: {
          50: '#f8f9fa', // Soft UI Background
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b', // Body Text
          600: '#475569',
          700: '#344767', // Heading Text (Soft UI Dark Blue)
          800: '#1e293b',
          900: '#0f172a',
        },
        // Soft UI Brand Colors
        fuchsia: { 500: '#cb0c9f', 600: '#830051' }, // Purple
        pink: { 500: '#d63384' },
      },
      boxShadow: {
        'soft-xl': '0 20px 27px 0 rgba(0,0,0,0.05)', // Card Shadow
        'soft-md': '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.02)', // Input/Button
        'soft-sm': '0 2px 4px 0 rgba(0,0,0,0.02)',
        'navbar': '0 2px 12px 0 rgba(0,0,0,0.06)',
      },
      borderRadius: {
        'xl': '1rem',   // 16px
        '2xl': '1.25rem' // 20px
      },
      backgroundImage: {
        'gradient-soft': 'linear-gradient(310deg, #7928ca, #ff0080)', // The Signature Gradient
        'gradient-dark': 'linear-gradient(310deg, #141727, #3a416f)',
      }
    } 
  }
}
