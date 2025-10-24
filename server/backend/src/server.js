// src/server.js
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
import { startScan } from './controllers/session.controller.js';

const app = express();

// Middlewares
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// __dirname workaround for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helmet CSP configuration
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'", "http:", "https:"]
,
        styleSrc: ["'self'", "'unsafe-inline'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        frameAncestors: ["'none'"],
      },
    },
  })
);

// Serve static assets
app.use(express.static(path.join(__dirname, "../public")));

// API routes
app.use("/api", routes);

// Default root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});


// fallback 404 for unknown routes (optional)
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  startScan()
});