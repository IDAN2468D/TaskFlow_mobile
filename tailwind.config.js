/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {

    extend: {
      colors: {
        obsidian: "#050505",
        surface: "#0a0a0b",
        "surface-low": "#0d0d0e",
        "surface-mid": "#121214",
        "surface-high": "#18181b",
        primary: "#818cf8",
        "primary-dark": "#4f46e5",
        secondary: "#c084fc",
        accent: "#a5b4fc",
        success: "#4ade80",
        warning: "#fbbf24",
        error: "#f87171",
        "text-main": "#ffffff",
        "text-dim": "rgba(255, 255, 255, 0.4)",
        "text-muted": "rgba(255, 255, 255, 0.2)",
      },
      borderRadius: {
        'xl': '24px',
        '2xl': '32px',
        'inner': '12px',
        'outer': '14px',
      },
    },
  },
  plugins: [],
}
