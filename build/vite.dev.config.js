/** @type {import('vite').UserConfig} */

import { fileURLToPath, URL } from "node:url";
import { defineConfig, splitVendorChunkPlugin } from "vite";
import { uglify } from "rollup-plugin-uglify";
import legacy from "@vitejs/plugin-legacy";
import vue2 from "@vitejs/plugin-vue2";
import vue2Jsx from "@vitejs/plugin-vue2-jsx";
import { visualizer } from "rollup-plugin-visualizer";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { dependencies } from "../package.json";
import { viteStaticCopy } from "vite-plugin-static-copy";

const renderChunks = (deps) => {
  let chunks = {};
  Object.keys(deps).forEach((key) => {
    chunks[key] = [key];
  });
  return chunks;
};

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.env": {},
  },
  server: {
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:8888/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    sourcemap: true,
    cssCodeSplit: true,
    assetsDir: "static",
    rollupOptions: {
      plugins: [
        uglify(),
        visualizer(),
        nodePolyfills({ protocolImports: true }),
      ],
      output: {
        manualChunks: {
          ...renderChunks(dependencies),
        },
      },
    },
  },
  css: {
    devSourcemap: true,
  },
  plugins: [
    vue2(),
    vue2Jsx(),
    splitVendorChunkPlugin(),
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
