import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import path from "path";

// Carregar variáveis de ambiente
export default defineConfig(({ mode }) => {
  // Carregar variáveis de ambiente com base no modo (development, production, etc.)
  const env = loadEnv(mode, process.cwd(), "");

  return {
    define: {
      "process.env": {
        API_URL_BACKEND: JSON.stringify(env.VITE_API_URL_BACKEND),
        VITE_CLERK_FRONTEND_API: JSON.stringify(env.VITE_CLERK_FRONTEND_API),
      },
    },
    plugins: [vue()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src/", import.meta.url)),
        "@backend": path.resolve(__dirname, "./backend/src"),
        "@upload": path.resolve(__dirname, "./backend/@upload"),
      },
    },
  };
});