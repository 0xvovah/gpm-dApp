import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";
import { fontSize } from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {},
      fontSize: {
        ...fontSize,
        sm: ["12px", "16px"],
        base: ["13px", "20px"],
        lg: ["16px", "24px"],
        xl: ["20px", "28px"],
      },
      fontFamily: {
        newsreader: ["var(--custom-font-newsreader)"],
        manrope: ["var(--font-manrope)"],
        poppins: ["var(--font-poppins)"],
      },
      colors: {
        label: "rgba(231, 254, 255, 0.66)",
        value: "rgba(231, 254, 255, 0.90)",
        action: "#3ABCC4",
        bg: "#1F212F",
        bg_main: "rgba(28, 39, 40, 0.81)",
        bg_main1: "rgba(21, 31, 32, 0.81)",
        // button: "rgba(8, 19, 19, 0.87)",
        green: "rgba(85, 191, 133, 0.96)",
        brown: "rgba(92, 67, 0, 0.96)",
        border_white: "rgba(231, 254, 255, 0.15)",
        border_white1: "rgba(231, 254, 255, 0.25)",
        bg_primary: "#3480F2",
        bg_green: "#68FF65",
        bg_yellow: "#FFDE00",
        red: "#F63E3E",
        light_blue: "#BCD5FB",
        bright_blue: "#07CEF8",
        value_grey: "#B7B7B7",
        bg_grey: "#6F6F6F",
        card_bg: "#393D55",
        card_bg_hover: "#64E0FA",
      },
      border: {},
      animation: {
        shake: "shake 0.25s ease-in-out infinite",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-7px)" },
          "75%": { transform: "translateX(7px)" },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
export default config;
