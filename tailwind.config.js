// tailwind.config.js
import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export const content = [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
  "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
  extend: {
    fontFamily: {
      playwrite: ["Playwrite"],
      inter: ["Inter"],
      "inter-italic": ["Inter Italic"]
    }
  },
};
export const darkMode = "class";
export const plugins = [nextui()];
