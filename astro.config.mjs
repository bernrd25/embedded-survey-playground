// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://bernrd25.github.io",
  base: "embedded-survey-playground",

  vite: {
    plugins: [tailwindcss()],
  },
});