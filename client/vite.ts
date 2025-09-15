import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";  // Ensure vite.config.ts is correct
import { nanoid } from "nanoid";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Correctly resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Debugging log to check resolved path for main.tsx
console.log("Resolved path for main.tsx:", path.resolve(__dirname, "client", "src", "main.tsx"));

const viteLogger = createLogger();

// Function for logging messages with timestamps
export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

// Setup Vite middleware and SSR
export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,  // Prevents Vite from loading its default config
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);  // Exit on error
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  // Use Vite's middlewares in the Express app
  app.use(vite.middlewares);

  // Handle all requests to load the HTML page and transform it using Vite
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      // Use the correct path for index.html based on Vite config (root: client)
      const clientTemplate = path.resolve(__dirname, "..", "client", "index.html");
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/client/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

// Serve static files from the client build folder
export function serveStatic(app: Express) {
  // Serve static files from Vite build output (dist/public)
  const distPath = path.resolve(__dirname, "..", "dist", "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath));

  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
