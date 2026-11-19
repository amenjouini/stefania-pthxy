import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" },
      screens: {
        "2xl": "1320px"
      }
    },
    extend: {
      colors: {
        cream: "#FBF6EE",
        sand: {
          DEFAULT: "#F3EADB",
          dark: "#E8DCC8"
        },
        line: "#E8DFD0",
        ink: {
          DEFAULT: "#1C2B2E",
          700: "#33464A",
          500: "#4F5F62",
          300: "#9AA6A7"
        },
        coral: {
          50: "#FFF3EE",
          100: "#FFE2D6",
          200: "#FFC4AD",
          400: "#F2774F",
          500: "#E4572E",
          600: "#CF4520",
          700: "#A8361A"
        },
        lagoon: {
          50: "#E9F6F3",
          100: "#CDEDE6",
          400: "#2BA393",
          600: "#0F766E",
          700: "#0B5C56"
        },
        sun: {
          100: "#FFF3D1",
          300: "#FFDB80",
          400: "#FFC857"
        },
        sky: {
          50: "#EBF5FB",
          100: "#D4EBF7",
          500: "#3B9FD8"
        }
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"]
      },
      boxShadow: {
        soft: "0 1px 2px rgba(28,43,46,.04), 0 8px 24px -8px rgba(28,43,46,.10)",
        lift: "0 2px 4px rgba(28,43,46,.04), 0 24px 48px -16px rgba(28,43,46,.22)",
        coral: "0 10px 24px -10px rgba(207,69,32,.55)"
      },
      borderRadius: {
        "4xl": "2rem"
      }
    }
  },
  plugins: [animate]
};
