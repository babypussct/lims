/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

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
        // Full Slate palette — Tailwind defaults + custom intermediate shades
        slate: {
          ...colors.slate,
          150: '#e8edf4',
          250: '#c3cdd9',
          255: '#c1cbd7',
          350: '#94a3b5',
          355: '#92a1b3',
          450: '#6b7d92',
          455: '#697b90',
          550: '#4a5b6e',
          650: '#3a4a5e',
          655: '#384858',
          750: '#283548',
          755: '#263346',
          805: '#1a2536',
          850: '#172032',
          955: '#080d16',
        },
        // Full Indigo palette — defaults + custom intermediate shades
        indigo: {
          ...colors.indigo,
          150: '#dfe5ff',
          350: '#93a5f8',
          405: '#6c7ff4',
          455: '#5a6cf0',
          505: '#4e5fde',
          650: '#3b45b5',
          655: '#3942b0',
          955: '#0c0f2b',
        },
        // Full Emerald palette — defaults + custom shades
        emerald: {
          ...colors.emerald,
          450: '#3abe8a',
          650: '#0f8a5a',
          955: '#031e13',
        },
        // Full Amber palette — defaults + custom shades
        amber: {
          ...colors.amber,
          450: '#e5a520',
          650: '#b57a0a',
          955: '#1a1000',
        },
        // Full Violet palette — defaults + custom shades
        violet: {
          ...colors.violet,
          405: '#886cf4',
          650: '#6931c8',
          850: '#2a1166',
        },
        // Full Rose palette — defaults + custom shades
        rose: {
          ...colors.rose,
          450: '#ef5075',
          955: '#1f0508',
        },
        // Full Red palette — defaults + custom shades
        red: {
          ...colors.red,
          450: '#f04040',
          650: '#c22424',
          655: '#be2222',
          955: '#1c0505',
        },
        // Full Blue palette — defaults + custom shades
        blue: {
          ...colors.blue,
          450: '#4d8fff',
          655: '#2b57b5',
        },
        // Full Cyan palette — defaults + custom shades
        cyan: {
          ...colors.cyan,
          650: '#0f7a96',
        },
        // Full Fuchsia palette — defaults + custom shades + Soft UI brand overrides
        fuchsia: {
          ...colors.fuchsia,
          150: '#f5d0ec',
          450: '#d63aad',
          500: '#cb0c9f', // Purple (Soft UI Brand)
          600: '#830051',
          650: '#72004a',
          850: '#3d0028',
          955: '#16000e',
        },
        // Soft UI Brand Colors
        pink: { ...colors.pink, 500: '#d63384' },
      },
      boxShadow: {
        'soft-xl': '0 20px 27px 0 rgba(0,0,0,0.05)', // Card Shadow
        'soft-md': '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.02)', // Input/Button
        'soft-sm': '0 2px 4px 0 rgba(0,0,0,0.02)',
        'navbar': '0 2px 12px 0 rgba(0,0,0,0.06)',
        // Micro shadows for premium feel
        '2xs': '0 1px 2px 0 rgba(0,0,0,0.03)',
        '3xs': '0 0.5px 1px 0 rgba(0,0,0,0.02)',
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
