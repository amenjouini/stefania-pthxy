import animate from "tailwindcss-animate";

/** Palette built around the brand sage #C1D9B6 (sage-200). */
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" },
      screens: {
        "2xl": "1280px"
      }
    },
    extend: {
      colors: {
        paper: "#FAFBF6",
        line: "#E3E8DD",
        sage: {
          50: "#F3F7F0",
          100: "#E7F0E2",
          200: "#C1D9B6",
          300: "#A9C99B",
          400: "#8DB57C",
          500: "#6A9A5A",
          600: "#4E7243",
          700: "#3D5A34",
          800: "#2F4728",
          900: "#1F2D1C"
        },
        ink: {
          DEFAULT: "#1F2D1C",
          700: "#3A4636",
          500: "#5C6B58",
          300: "#A3AE9F"
        },
        danger: {
          50: "#FDF0EE",
          600: "#B42318"
        }
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"]
      },
      boxShadow: {
        soft: "0 1px 2px rgba(31,45,28,.04), 0 8px 24px -10px rgba(31,45,28,.12)",
        lift: "0 2px 6px rgba(31,45,28,.06), 0 24px 48px -16px rgba(31,45,28,.28)"
      },
      borderRadius: {
        "4xl": "2rem"
      }
    }
  },
  plugins: [animate]
};
