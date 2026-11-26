import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import sendEmailHandler from "./api/send-email";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function localApiPlugin(): Plugin {
  return {
    name: "local-api-send-email",
    configureServer(server) {
      server.middlewares.use("/api/send-email", (req, res) => {
        const chunks: Buffer[] = [];
        req.on("data", (chunk: Buffer) => chunks.push(chunk));
        req.on("end", async () => {
          const rawBody = Buffer.concat(chunks).toString("utf8");
          const resAdapter = {
            status(code: number) {
              res.statusCode = code;
              return {
                json(data: unknown) {
                  res.setHeader("Content-Type", "application/json");
                  res.end(JSON.stringify(data));
                },
              };
            },
          };

          await sendEmailHandler({ method: req.method, body: rawBody }, resAdapter);
        });
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, "");
  if (env.RESEND_API_KEY) process.env.RESEND_API_KEY ??= env.RESEND_API_KEY;
  if (env.RESEND_FROM_EMAIL) process.env.RESEND_FROM_EMAIL ??= env.RESEND_FROM_EMAIL;

  return {
    plugins: [react(), tailwindcss(), viteSingleFile(), localApiPlugin()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  };
});
