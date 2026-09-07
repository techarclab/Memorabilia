import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1.5rem", screens: { "2xl": "1240px" } },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        /* JPP brand scale — forest for proof surfaces, gold for emphasis */
        forest: {
          DEFAULT: "hsl(var(--forest))",
          light: "hsl(var(--forest-light))",
          lighter: "hsl(var(--forest-lighter))",
        },
        gold: { DEFAULT: "hsl(var(--gold))", light: "hsl(var(--gold-light))" },
        shell: "hsl(var(--shell))",
      },
      backgroundImage: {
        "wash-hero": "var(--wash-hero)",
        "wash-peach": "var(--wash-peach)",
        "wash-sky": "var(--wash-sky)",
        "wash-mint": "var(--wash-mint)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
        xl: "calc(var(--radius) + 8px)",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "SF Mono", "Menlo", "monospace"],
      },
      letterSpacing: { tightest: "-.042em", tighter: "-.034em" },
      transitionTimingFunction: { swift: "cubic-bezier(.32,.72,0,1)" },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        rise: { from: { opacity: "0", transform: "translateY(14px)" }, to: { opacity: "1", transform: "none" } },
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
      },
      animation: {
        "accordion-down": "accordion-down .25s ease-out",
        "accordion-up": "accordion-up .25s ease-out",
        rise: "rise .8s cubic-bezier(.32,.72,0,1) forwards",
        marquee: "marquee 48s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
