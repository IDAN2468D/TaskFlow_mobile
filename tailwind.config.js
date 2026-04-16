/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {

    extend: {
      colors: {
        obsidian: "#09090b",
        zinc: "#18181b",
        indigo: "#6366f1",
        emerald: "#10b981",
        amber: "#f59e0b",
      },
    },
  },
  plugins: [],
}
