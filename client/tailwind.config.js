/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}"
  ],

  theme: {
    extend: {
      dropShadow: {
        "2xl": "0 0 50px -12px rgba(0, 0, 0, 0.25)"
      },
      boxShadow: {
        "2xl": "0 0 50px -12px rgba(0, 0, 0, 0.25)",
        cart: "0 -2px 4px black"
      },
      variants: {
        width: ["responsive", "hover", "focus"]
      },
      borderWidth: {
        max: "20px"
      },
      width: {
        max: "40rem"
      },
      height: {
        banner: "30rem"
      },
      animation: {
        bounce200: "bounce 1s infinite 200ms",
        bounce400: "bounce 1s infinite 400ms",
        fade: "fadeOut 5s ease-in-out",
        ping: "ping 2s linear infinite",
        upto: "upto 2s linear infinite",
        "fade-down": "fade-down linear",
        "fade-up": "fade-up 0.3s linear",
        dropDown: "dropDown 1s linear",
        // spin: "spin 0.4s linear",
        "un-spin": "un-spin 0.4s linear"
      },
      transformOrigin: {
        "center-left": "center left",
        "center-right": "center right"
      },

      keyframes: (theme) => ({
        // spin: {
        //   "0%": { transform: "rotate(0deg)" },
        //   "100%": { transform: "rotate(360deg)" }
        // },
        "un-spin": {
          "0%": { transform: "rotate(360deg)" },
          "100%": { transform: "rotate(0deg)" }
        },

        dropDown: {
          "0%": { height: "0px" },
          "100%": { height: "5rem" }
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(-5px)" },
          "100%": { opacity: "1", transform: "translateY(0px)" }
        },
        "fade-down": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" }
        },
        fadeOut: {
          "0%": { backgroundColor: theme("colors.red.300") },
          "100%": { backgroundColor: theme("colors.transparent") }
        },
        ping: {
          "0%": {
            transform: "scale(0.95)",
            opacity: "1"
          },
          "75%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.95)", opacity: "1" }
        },

        upto: {
          "0%": {
            transform: "translateY(0px)"
          },
          "25%": {
            transform: "translateY(-5px)"
          },
          "50%": {
            transform: "translateY(0px)"
          },
          "75%": {
            transform: "translateY(5px)"
          },
          "100%": {
            transform: "translateY(0px)"
          }
        }
      })
    }
  },
  plugins: []
}
