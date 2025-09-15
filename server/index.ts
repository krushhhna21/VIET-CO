import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
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
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

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
    const possibleClientDirs = [
      join(__dirname, '..', 'dist', 'client'),
      join(__dirname, '..', 'client', 'dist'),
      join(__dirname, '..', '..', 'client', 'dist'),
      join(__dirname, 'client', 'dist')
    ];

    let clientDistDir = possibleClientDirs[0];
    for (const dir of possibleClientDirs) {
      if (existsSync(dir)) {
        clientDistDir = dir;
        console.log(`Found client build directory at: ${dir}`);
        break;
      } else {
        console.log(`Client build directory not found at: ${dir}`);
      }
    }

    app.use(express.static(clientDistDir));
    
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