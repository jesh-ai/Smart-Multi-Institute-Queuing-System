// src/server.js
import express from 'express';
import compression from 'compression';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
import { startScan } from './controllers/session.controller.js';

const app = express();

// middlewares
app.use(compression());
app.use(cors());
app.use(express.json());

// __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  startScan()
});