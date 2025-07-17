/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}", 
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        'ubuntu-bold': ['Ubuntu-Bold', 'sans-serif'],
        'ubuntu-regular': ['Ubuntu-Regular', 'sans-serif'],
        'ubuntu-light': ['Ubuntu-Light', 'sans-serif'],
        'ubuntu-medium': ['Ubuntu-Medium', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

