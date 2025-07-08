import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes";
import { serveStatic, log } from "../server/vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.removeHeader("Content-Security-Policy");
  res.removeHeader("X-Frame-Options");
  res.setHeader("X-Frame-Options", "ALLOWALL");
  next();
});

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error("Server error:", err);
  res.status(status).json({ message });
});

// Setup static file serving for production
serveStatic(app);

// Register all routes
await registerRoutes(app);

export default app; 