import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { db } from './db';
import { users } from '@shared/schema';
import { execSync } from 'child_process';
import { setupVite, serveStatic, log } from "../client/vite";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Custom middleware for logging requests
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Ensure database schema exists (fallback if Render start command skipped migrations)
  async function ensureSchema() {
    try {
      await db.select({ id: users.id }).from(users).limit(1);
      console.log('[migrate] Schema already present');
    } catch (err: any) {
      if (err && err.code === '42P01') { // undefined table
        console.log('[migrate] Detected missing tables (42P01). Running drizzle-kit push...');
        try {
          execSync('npx drizzle-kit push', { stdio: 'inherit' });
          console.log('[migrate] drizzle-kit push completed');
        } catch (pushErr) {
          console.error('[migrate] Failed to push schema:', (pushErr as any)?.message || pushErr);
        }
      } else {
        console.error('[migrate] Unexpected error while checking schema:', err);
      }
    }
  }

  await ensureSchema();

  const server = await registerRoutes(app);

  // Development setup with Vite
  if (app.get("env") === "development") {
    try {
      await setupVite(app, server);
    } catch (error) {
      console.error("Vite setup failed:", error);
      serveStatic(app); // Fallback to static if Vite setup fails
    }
  } else {
    // Production static file serving
    const clientDistDir = join(process.cwd(), 'dist', 'client');
    console.log('Serving static files from:', clientDistDir);
    
    // Serve static files with proper MIME types
    app.use(express.static(clientDistDir, {
      setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
          res.setHeader('Content-Type', 'text/css');
        }
        // Add cache control headers
        res.setHeader('Cache-Control', 'public, max-age=31536000');
      }
    }));
    
    // Health check endpoint
    app.get('/health', (req, res) => {
      res.status(200).json({ status: 'ok' });
    });

    // Debug endpoint to check build paths
    app.get('/debug', (req, res) => {
      const debugInfo = {
        __dirname,
        clientDistDir,
        env: process.env.NODE_ENV,
        buildExists: existsSync(clientDistDir),
        indexExists: existsSync(join(clientDistDir, 'index.html'))
      };
      res.json(debugInfo);
    });

    // Serve the client app's index.html for all non-API routes (SPA support)
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      const indexPath = join(clientDistDir, 'index.html');
      console.log(`Attempting to serve index.html from: ${indexPath}`);
      
      if (!existsSync(indexPath)) {
        console.error(`index.html not found at: ${indexPath}`);
        return res.status(500).send('Application files not found');
      }

      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error('Error sending index.html:', err);
          res.status(500).send('Error loading application');
        }
      });
    });
  }

  // Server listening on configured port
  const port = parseInt(process.env.PORT || '3000', 10);
  const host = process.env.HOST || '0.0.0.0';
  server.listen(port, host, () => {
    log(`Server listening on ${host}:${port}`);
  });
})();