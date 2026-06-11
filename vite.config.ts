import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import tailwindcss from "@tailwindcss/vite";
import { paraglide } from "@inlang/paraglide-js-adapter-vite";

export default defineConfig({
  plugins: [
    solid(),
    tailwindcss(),
    paraglide({
      project: "./project.inlang",
      outdir: "./src/paraglide",
    }),
  ],
  server: {
    port: 3000,
    strictPort: true,
  },
});
