import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#16C7C7",
          50: "#E8FAFA",
          100: "#C5F3F3",
          200: "#8FE8E8",
          300: "#5ADCDC",
          400: "#2DD1D1",
          500: "#16C7C7",
          600: "#10A3A3",
          700: "#0B7F7F",
          800: "#065B5B",
          900: "#033838",
        },
        secondary: {
          DEFAULT: "#1F6BFF",
          50: "#EBF1FF",
          100: "#C8DBFF",
          200: "#91B7FF",
          300: "#5A93FF",
          400: "#3D7FFF",
          500: "#1F6BFF",
          600: "#1456CC",
          700: "#0A4099",
          800: "#052B66",
          900: "#021533",
        },
        accent: "#0F172A",
        background: "#F8FAFC",
        surface: "#FFFFFF",
        success: "#22C55E",
        warning: "#F59E0B",
        error: "#EF4444",
        muted: {
          DEFAULT: "#94A3B8",
          foreground: "#64748B",
        },
        border: "#E2E8F0",
        "dark-bg": "#0F172A",
        "dark-surface": "#1E293B",
        "dark-border": "#334155",
      },
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)",
        "card-hover": "0 10px 25px -5px rgb(22 199 199 / 0.15), 0 4px 6px -2px rgb(22 199 199 / 0.05)",
        "card-lg": "0 20px 40px -10px rgb(0 0 0 / 0.1)",
        glow: "0 0 40px rgb(22 199 199 / 0.3)",
        "glow-blue": "0 0 40px rgb(31 107 255 / 0.3)",
        glass: "0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #16C7C7 0%, #1F6BFF 100%)",
        "gradient-hero": "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
        "gradient-card": "linear-gradient(135deg, rgba(22,199,199,0.1) 0%, rgba(31,107,255,0.1) 100%)",
        "gradient-radial": "radial-gradient(ellipse at center, var(--tw-gradient-stops))",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-in": "slideIn 0.4s ease-out",
        "float": "float 3s ease-in-out infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "counter": "counter 2s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgb(22 199 199 / 0.3)" },
          "100%": { boxShadow: "0 0 40px rgb(22 199 199 / 0.6)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
