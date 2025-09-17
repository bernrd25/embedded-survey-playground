import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode, command }) => {
  // Determine base path based on environment
  let base = "/";

  if (command === "build") {
    // Production build for GitHub Pages
    base = "/embedded-survey-playground/";
  } else if (mode === "production") {
    // Production mode but not building (e.g., preview)
    base = "/embedded-survey-playground/";
  }
  // Development mode uses default '/' base

  return {
    plugins: [react(), tailwindcss()],
    base,
    build: {
      outDir: "dist",
      assetsDir: "assets",
    },
  };
});
