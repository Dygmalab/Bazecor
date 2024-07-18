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
      fontWeight: {
        medium: "501",
      },
      fontSize: {
        xxs: "0.625rem", // 10px
        "2xxs": "0.6875rem", // 11px
        "3xxs": "0.75rem", // 12px
        ssm: "0.8125rem", // 13px
        "2ssm": "0.875em", // 14px
        "2xl": "1.5rem",
        "3xl": "2rem",
        "4xl": "2.625rem",
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
          100: "rgb(85,  239, 196)",
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
        configButton:
          "linear-gradient(90deg,rgba(255,255,255,0.3) 20%,rgba(255,255,255,0) 100%), linear-gradient(rgba(176,175,194,0.3), rgba(176,175,194,0.3))",
        configButtonHover:
          "linear-gradient(90deg,rgba(255,255,255,0.4) 20%,rgba(255,255,255,0) 100%), linear-gradient(rgba(196,201,213,0.8), rgba(196,201,213,0.8))",
        configButtonActive:
          "linear-gradient(90deg,rgba(255,255,255,0) 20%,rgba(255,255,255,0) 100%), linear-gradient(rgba(196,201,213,0), rgba(196,201,213,0))",
        configButtonDark:
          "linear-gradient(90deg,rgba(255,255,255,0.1) -20%,rgba(255,255,255,0) 120%), linear-gradient(0deg,rgba(87,97,126,0.25), rgba(87,97,126,0.25)), linear-gradient(rgba(11,2,25,0.2), rgba(11,2,25,0.2))",
        configButtonDarkHover:
          "linear-gradient(90deg,rgba(255,255,255,0.15) -20%,rgba(255,255,255,0) 120%), linear-gradient(rgba(87,97,126,0.6), rgba(87,97,126,0.6))",
        configButtonDarkActive:
          "linear-gradient(90deg,rgba(255,255,255,0) -20%,rgba(255,255,255,0) 120%), linear-gradient(rgba(87,97,126,0), rgba(87,97,126,0))",
        warningBanner:
          "linear-gradient(0deg, rgba(254, 202, 87, 0.1) 0%, rgba(254, 202, 87, 0.1) 100%), linear-gradient(0deg, rgba(255, 255, 255, 0.1) 0%, rgba(254, 255, 255, 0.1) 100%)",
        warningBannerDark:
          "linear-gradient(0deg, rgba(254, 202, 87, 0.08) 0%, rgba(254, 202, 87, 0.08) 100%), linear-gradient(0deg, rgba(63, 66, 90, 0.02) 0%, rgba(63, 66, 90, 0.02) 100%)",
        buttonDisabled: "linear-gradient(90deg, #E8EBEE -20%, #DEE0E4 80%)",
        buttonDisabledDark: "linear-gradient(90deg, #57617E -20%, #3F425A 80%)",
        blurPink: "linear-gradient(180deg,rgba(0,194,255,0) 0%,#FF29C3 100%)",
        blurBlue: "linear-gradient(180deg,rgba(24,75,255,0) 0%,#174AFF 100%)",
        body: "url('/assets/images/bg-body.jpg')",
        cardDeviceTextureLight: "url('@Assets/light/bg-texture-with-lines.jpg')",
        cardDeviceTextureDark: "url('@Assets/dark/bg-texture-with-lines.jpg')",
        cardDefyOffLight: "url('@Assets/base/devices/defy-white-offline.png')",
        cardDefyOnLight: "url('@Assets/base/devices/defy-white-on.png')",
        cardDefyOffDark: "url('@Assets/base/devices/defy-black-offline.png')",
        cardDefyOnDark: "url('@Assets/base/devices/defy-black-on.png')",
        cardRaiseOffLight: "url('@Assets/base/devices/raise-ansi-white-offline.png')",
        cardRaiseOnLight: "url('@Assets/base/devices/raise-ansi-white-on.png')",
        cardRaiseOffDark: "url('@Assets/base/devices/raise-ansi-black-offline.png')",
        cardRaiseOnDark: "url('@Assets/base/devices/raise-ansi-black-on.png')",
        bgCardOfflineLight:
          "linear-gradient(180deg, rgba(240, 240, 240, 0.60) 1.33%, rgba(240, 240, 240, 0.00) 51.04%, rgba(240, 240, 245, 0.35) 100%), linear-gradient(rgba(30, 30, 55, 0.20), rgba(30, 30, 55, 0.20))",
        bgCardOfflineDark:
          "linear-gradient(180deg, rgba(48, 49, 73, 0.60) 1.33%, rgba(48, 57, 73, 0.00) 51.04%, rgba(48, 57, 73, 0.35) 100%), linear-gradient(rgba(48, 51, 73, 0.60), rgba(48, 51, 73, 0.60))",
        footer: "url('/assets/images/bg-footer.png')",
        noise: "url('/assets/images/noise.png')",
        home: "url('/assets/images/home-hero-background.jpg')",
        lightAccent: "url('@Assets/base/light-accent--md.png')",
        lightAccentLg: "url('@Assets/base/light-accent--lg.png')",
        tabMenuDark: "url(@Assets/dark/noise-tabs.jpg)",
        tabMenu: "url(@Assets/light/noise-tabs.jpg)",
        tabGradientDarkActive:
          "linear-gradient(100deg, rgba(240, 242, 244, 0.12) -24%, rgba(255, 255, 255, 0.00) 40%), rgba(18, 19, 36, 0.60))",
        gradientWarning: "linear-gradient(180deg, #FE007C 0%, #FF9F43 0.01%, #FECA57 100%)",
        gradientDanger: "linear-gradient(180deg, #FE007C 0%, #FE007C 0.01%, #FF6B6B 100%)",
        gradientSuccess: "linear-gradient(180deg, #00CEC5 0%, #00CEC9 0.01%, #55EFC4 100%)",
        gradientWarningLight:
          "linear-gradient(90deg, rgba(255, 107, 107, 0.25) -20%, rgba(255, 159, 67, 0.05) 40%), linear-gradient(rgb(240, 242, 244), rgb(240, 242, 244))",
        gradientWarningDark:
          "linear-gradient(90deg, rgba(255, 107, 107, 0.25) -10%, rgba(255, 159, 67, 0) 40%), linear-gradient(rgb(37, 39, 59), rgb(37, 39, 59))",
        gradientErrorLight:
          "linear-gradient(90deg, rgba(255, 4, 90, 0.25) -20%, rgba(255, 4, 67, 0.05) 40%), linear-gradient(rgb(240, 242, 244), rgb(240, 242, 244))",
        gradientErrorDark:
          "linear-gradient(90deg, rgba(255, 4, 90, 0.25) -10%, rgba(255, 4, 90, 0) 40%), linear-gradient(rgb(37, 39, 59), rgb(37, 39, 59))",
        gradientSuccessLight:
          "linear-gradient(90deg, rgba(0, 206, 201, 0.25) -20%, rgba(0, 206, 201, 0.05) 40%), linear-gradient(rgb(240, 242, 244), rgb(240, 242, 244))",
        gradientSuccessDark:
          "linear-gradient(90deg, rgba(0, 206, 201, 0.25) -10%, rgba(0, 206, 201, 0) 40%), linear-gradient(rgb(37, 39, 59), rgb(37, 39, 59))",
      },
      backgroundPosition: {
        position: "left -8rem top -8rem",
        positionFooter: "center bottom -124px",
      },
      borderRadius: {
        "2sm": "3px",
        regular: "6px",
      },
      boxShadow: {
        dropdown: "0px 32px 72px -32px rgba(26, 17, 46, 0.50), 16px 32px 32px -16px rgba(11, 2, 25, 0.20)",
        buttonConfigLight: "0px 2px 0px rgba(141,132,188,0.2), 0px 0px 0px 1px rgba(209,207,234,0.5) inset",
        buttonConfigLightHover: "0px 2px 0px rgba(141,132,188,0.4)",
        buttonConfigLightActive: "0px 3px 0px rgba(37,39,59,0.05), 0px 16px 16px -8px rgba(76,102,177,0.3)",
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
        "bounce-error": {
          "0%, 100%": {
            transform: "translateX(0)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateX(-15px)",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "bounce-error": "bounce-error 0.2s ease-in-out 0s 3",
        "spin-fast": "spin 0.4s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@xpd/tailwind-3dtransforms")],
};
