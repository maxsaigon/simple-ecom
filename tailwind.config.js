/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#2563eb',
        'primary-foreground': '#fff',
        'card': '#fff',
        'accent': '#f1f5f9',
        'accent-light': '#f8fafc',
        'foreground': '#222',
        'muted-foreground': '#6b7280',
      },
      boxShadow: {
        'glow': '0 0 16px 2px #2563eb33',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)',
        'gradient-subtle': 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)',
      },
    },
  },
  plugins: [],
};