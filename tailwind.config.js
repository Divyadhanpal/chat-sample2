/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#0EA5E9',
          50: '#F0F9FF',
          // ... add other shades as needed
        },
        accent: {
          DEFAULT: '#5C6AC4',
          light: '#7C85D5',
          dark: '#4B5AB2',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          150: '#eaeff4',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        navy: {
          50: '#E7E9EF',
          100: '#C2C9D6',
          200: '#A3ADC2',
          300: '#697A9B',
          400: '#5C6B8A',
          450: '#465675',
          500: '#384766',
          600: '#313E59',
          700: '#26334D',
          800: '#1D2841',
          900: '#0F172A',
        },
      },
    },
  },
  plugins: [],
};
