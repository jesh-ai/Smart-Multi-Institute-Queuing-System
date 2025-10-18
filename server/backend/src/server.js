// src/server.js
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
import { results } from './routes/devices.js';
import { getCurrentSession } from './routes/session.js';

const app = express();

// middlewares
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helmet with explicit CSP so:
// - inline <script> in index.html can run ('unsafe-inline')
// - QR data:image/png;base64,... can be used for <img> (data:)
// - fetch() to the same origin is allowed (connect-src 'self')
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        frameAncestors: ["'none'"]
      }
    }
  })
);


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  next();
});


// Serve static assets from ../public
app.use(express.static(path.join(__dirname, '../public')));

// API routes
app.use('/api', routes);

// Serve index explicitly at root (helps avoid accidental JSON at /)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});


// fallback 404 for unknown routes (optional)
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${PORT}`);
});