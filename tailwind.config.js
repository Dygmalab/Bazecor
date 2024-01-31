/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  prefix: "",
  theme: {
    fontFamily: {
      sans: ['"Libre Franklin"', "Helvetica", "Arial", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
    },
    extend: {
      fontSize: {
        "2xl": "1.5rem",
        "3xl": "2rem",
        "4xl": "2.625rem",
      },
      fontWeight: {
        normal: "395",
      },
      colors: {
        primary: "rgb(254, 0, 124)",
        secondary: "rgb(107, 20, 249)",
        black: "rgb(0,0,0)",
        discord: "rgb(88, 101, 242)",
        reddit: "rgb(255, 69, 0)",
        darkish: "rgb(23, 20, 37)",
        pink: {
          100: "rgb(252, 221, 236)",
          200: "rgb(241, 120, 182)",
          300: "rgb(239, 93, 168)",
        },
        purple: {
          100: "rgb(162, 155, 254)",
          200: "rgb(120, 121, 241)",
          300: "rgb(108, 92, 231)",
        },
        gray: {
          25: "rgb(240, 242, 244)",
          50: "rgb(226, 228, 234)",
          100: "rgb(196, 201, 213)",
          200: "rgb(151, 160, 180)",
          300: "rgb(123, 134, 158)",
          400: "rgb(107, 119, 148)",
          500: "rgb(87, 97, 126)",
          600: "rgb(63, 66, 90)",
          700: "rgb(48, 51, 73)",
          800: "rgb(37, 39, 59)",
          900: "rgb(11, 2, 25)",
        },
        red: {
          100: "rgb(255, 107, 107)",
          200: "rgb(255, 4, 90)",
        },
        orange: {
          100: "rgb(254, 202, 87)",
          200: "rgb(255, 159, 67)",
        },
        green: {
          100: "rgb(85, 239, 196)",
          200: "rgb(0, 206, 201)",
        },
        mint: {
          100: "rgb(181, 203, 129)",
          200: "rgb(161, 188, 94)",
          300: "rgb(135, 162, 67)",
        },
        teal: {
          100: "rgb(95, 206, 221)",
          200: "rgb(53, 194, 212)",
          300: "rgb(37, 161, 177)",
        },
      },
      backgroundImage: {
        appDarkBackground: "url(@Assets/dark/darkBackground.png)",
        appLightBackground: "url(@Assets/light/lightBackground.png)",
        linear: "linear-gradient(75deg,#FE007C,#6B14F6,#6B14F9,#FE007c)",
        linearButton: "linear-gradient(90deg, rgb(254, 0, 124) 0%, rgb(107, 20, 249) 100%)",
        buttonDisabled: "linear-gradient(90deg, #57617E 0%, #3F425A 100%)",
        blurPink: "linear-gradient(180deg,rgba(0,194,255,0) 0%,#FF29C3 100%)",
        blurBlue: "linear-gradient(180deg,rgba(24,75,255,0) 0%,#174AFF 100%)",
        body: "url('/assets/images/bg-body.jpg')",
        footer: "url('/assets/images/bg-footer.png')",
        noise: "url('/assets/images/noise.png')",
        home: "url('/assets/images/home-hero-background.jpg')",
        lightAccent: "url('@Assets/base/light-accent--md.png')",
        tabMenuDark: "url(@Assets/dark/noise-tabs.jpg)",
        tabMenu: "url(@Assets/light/noise-tabs.jpg)",
        tabGradientDarkActive:
          "linear-gradient(100deg, rgba(240, 242, 244, 0.12) -24%, rgba(255, 255, 255, 0.00) 40%), rgba(18, 19, 36, 0.60))",
      },
      backgroundPosition: {
        position: "left -8rem top -8rem",
        positionFooter: "center bottom -124px",
      },
      boxShadow: {
        dropdown: "0px 32px 72px -32px rgba(26, 17, 46, 0.50), 16px 32px 32px -16px rgba(11, 2, 25, 0.20)",
        buttonConfig: " 0px 2px 0px 0px rgba(0, 0, 0, 0.10)",
        buttonConfigHover: "0px 16px 16px -8px rgba(87, 97, 126, 0.30), 0px 3px 0px 0px rgba(37, 39, 59, 0.25)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@xpd/tailwind-3dtransforms")],
};
