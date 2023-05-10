/** @type {import('vite').UserConfig} */

import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import legacy from "@vitejs/plugin-legacy";
import vue2 from "@vitejs/plugin-vue2";
import vue2Jsx from "@vitejs/plugin-vue2-jsx";
import { visualizer } from "rollup-plugin-visualizer";
import { dependencies } from "../package.json";
import { viteStaticCopy } from "vite-plugin-static-copy";

const renderChunks = (deps) => {
  let chunks = {};
  chunks["vue"] = [];
  chunks["chart"] = [];
  chunks["utils"] = [];
  Object.keys(deps).forEach((key) => {
    if (key.includes("vue") || key.includes("vee") || key.includes("date"))
      chunks["vue"].push(key);
    else if (key.includes("chart")) chunks["chart"].push(key);
    else if (key.includes("yup") || key.includes("papaparse"))
      chunks["utils"].push(key);
    else chunks[key] = [key];
  });
  return chunks;
};

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
  },
  build: {
    sourcemap: true,
    cssCodeSplit: true,
    assetsDir: "static",
    minify: "esbuild",
    rollupOptions: {
      plugins: [visualizer({ template: "sunburst" })],
      output: {
        manualChunks: {
          ...renderChunks(dependencies),
        },
      },
    },
  },
  plugins: [
    vue2(),
    vue2Jsx(),
    // splitVendorChunkPlugin(),
    legacy({
      targets: ["ie >= 11"],
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
    }),
    viteStaticCopy({
      targets: [
        {
          src: "./src/assets/countries_modified.json",
          dest: "static/data/",
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("../src", import.meta.url)),
    },
  },
});
