import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig, loadEnv, type Plugin } from "vite";

function stripServerSecretsFromClientEnv(): Plugin {
  return {
    name: "strip-server-secrets-from-client-env",
    enforce: "pre",
    configResolved(resolved) {
      if (resolved.env && "VITE_GEMINI_API_KEY" in resolved.env) {
        delete resolved.env["VITE_GEMINI_API_KEY"];
      }
    },
  };
}

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // Expose server-only AI keys strictly to Node dev server memory without bundling them into client chunks.
  if (command === "serve") {
    const serverGeminiKey =
      env["GEMINI_API_KEY"] ||
      env["AI_API_KEY"] ||
      env["GOOGLE_AI_KEY"] ||
      env["VITE_GEMINI_API_KEY"];
    if (serverGeminiKey && !process.env["GEMINI_API_KEY"]) {
      process.env["GEMINI_API_KEY"] = serverGeminiKey;
    }
  }

  return {
    resolve: {
      tsconfigPaths: true,
    },
    plugins: [
      stripServerSecretsFromClientEnv(),
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
    environments: {
      client: {
        build: {
          rolldownOptions: {
            output: {
              codeSplitting: {
                groups: [
                  {
                    name: "vendor-react",
                    test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
                    priority: 30,
                  },
                  {
                    name: "vendor-router",
                    test: /[\\/]node_modules[\\/](@tanstack|seroval)[\\/]/,
                    priority: 25,
                  },
                  {
                    name: "vendor-motion",
                    test: /[\\/]node_modules[\\/](gsap|lenis)[\\/]/,
                    priority: 20,
                  },
                  {
                    name: "vendor-supabase",
                    test: /[\\/]node_modules[\\/]@supabase[\\/]/,
                    priority: 20,
                  },
                  {
                    name: "vendor-icons",
                    test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
                    priority: 15,
                  },
                ],
              },
            },
          },
        },
      },
    },
  };
});
