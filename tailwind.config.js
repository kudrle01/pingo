
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
        surface: {
          950: "#07060f",
          900: "#0e0c1a",
          800: "#161326",
          700: "#1e1a33",
          600: "#272340",
        },
        game: {
          red:    "#e74c3c",
          blue:   "#3498db",
          yellow: "#f39c12",
          green:  "#2ecc71",
        },
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #7c3aed 0%, #db2777 100%)",
        "brand-gradient-soft": "linear-gradient(135deg, #6d28d9 0%, #be185d 100%)",
        "surface-gradient": "linear-gradient(180deg, #0e0c1a 0%, #07060f 100%)",
      },
      boxShadow: {
        "glow-brand": "0 0 20px rgba(139,92,246,0.45), 0 0 60px rgba(139,92,246,0.15)",
        "glow-sm":    "0 0 12px rgba(139,92,246,0.35)",
        "glow-pink":  "0 0 20px rgba(236,72,153,0.4)",
        "card":       "0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
        "card-hover": "0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
      },
      animation: {
        "gradient-shift": "gradient-shift 6s ease infinite",
        "float":          "float 3s ease-in-out infinite",
        "pulse-glow":     "pulse-glow 2s ease-in-out infinite",
        "pop-in":         "pop-in 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
      },
      keyframes: {
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%":       { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-8px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(139,92,246,0.3)" },
          "50%":      { boxShadow: "0 0 40px rgba(139,92,246,0.7), 0 0 80px rgba(139,92,246,0.3)" },
        },
        "pop-in": {
          "0%":   { opacity: "0", transform: "scale(0.7)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
