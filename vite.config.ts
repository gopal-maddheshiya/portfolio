import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    resolve: {
      tsconfigPaths: true,
    },
    define: {
      "process.env.GEMINI_API_KEY": JSON.stringify(
        env["GEMINI_API_KEY"] || env["VITE_GEMINI_API_KEY"] || "",
      ),
      "process.env.VITE_GEMINI_API_KEY": JSON.stringify(
        env["VITE_GEMINI_API_KEY"] || env["GEMINI_API_KEY"] || "",
      ),
    },
    plugins: [
      tailwindcss(),
      tanstackStart({
        // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
        server: { entry: "server" },
      }),
      ...(command === "build"
        ? [
            nitro({
              defaultPreset: env["NITRO_PRESET"] || "vercel",
            }),
          ]
        : []),
      react(),
    ],
  };
});
