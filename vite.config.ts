import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        background: "./background.ts",
        popup: "./popup/popup.html",
      },
      output: {
        assetFileNames: (chunkInfo) => {
          return chunkInfo.name === "popup.css"
            ? "popup/[name].css"
            : "assets/[name]-[hash][extname]";
        },
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === "popup"
            ? "popup/[name].js"
            : "[name].js";
        },
      },
    },
  },
  plugins: [
    viteReact(),
    viteStaticCopy({
      targets: [
        {
          src: "manifest.json",
          dest: ".",
        },
      ],
    }),
  ],
});
