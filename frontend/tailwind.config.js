/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#185a86',
        'primary-light': '#398bb1',
        'primary-soft': '#80b8d6',
        accent: '#f6ba41',
        danger: '#d64d2e',
        surface: '#f3f6fa',
        'surface-alt': '#ffffff',
        'surface-dark': '#10263b',
        'surface-dark-alt': '#153852',
        'text-primary': '#132238',
        'text-muted': '#3d4f66',
        'text-dark': '#e8f2ff',
        'text-dark-muted': '#b3cbe0',
      },
      fontFamily: {
        sora: ['"Sora"', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
