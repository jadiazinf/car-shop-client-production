// tailwind.config.js
import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export const content = [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
  "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
];

export const theme = {
  extend: {
    colors: {
      error: "#F31260",
    },
    boxShadow: {
      "y-offset-sm": "0 2px 4px rgba(0, 0, 0, 0.1)",
      "y-offset-md": "0 4px 6px rgba(0, 0, 0, 0.1)",
      "y-offset-lg": "0 8px 10px rgba(0, 0, 0, 0.1)",
      "y-offset-xl": "0 12px 16px rgba(0, 0, 0, 0.1)",
      "y-offset-2xl": "0 16px 24px rgba(0, 0, 0, 0.1)",
      "y-offset-3xl": "0 24px 32px rgba(0, 0, 0, 0.1)",
      "y-inset-sm": "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
      "y-inset-md": "inset 0 4px 6px rgba(0, 0, 0, 0.1)",
      "y-inset-lg": "inset 0 8px 10px rgba(0, 0, 0, 0.1)",
      "y-inset-xl": "inset 0 12px 16px rgba(0, 0, 0, 0.1)",
      "y-inset-2xl": "inset 0 16px 24px rgba(0, 0, 0, 0.1)",
      "y-inset-3xl": "inset 0 24px 32px rgba(0, 0, 0, 0.1)",
      "extend-sm": "0 4px 20px rgba(0, 0, 0, 0.1)",
      "extend-md": "0 10px 30px rgba(0, 0, 0, 0.15)",
      "extend-lg": "0 20px 40px rgba(0, 0, 0, 0.2)",
      "extend-xl": "0 30px 60px rgba(0, 0, 0, 0.25)",
      "extend-2xl": "0 40px 80px rgba(0, 0, 0, 0.3)",
      "extend-3xl": "0 50px 100px rgba(0, 0, 0, 0.35)",
    },
    fontFamily: {
      playwrite: ["Playwrite"],
      inter: ["Inter"],
      "inter-italic": ["Inter Italic"],
    },
  },
};
export const darkMode = "class";
export const plugins = [heroui()];
