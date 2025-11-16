// src/server.js
import app from './app.js';
import { instituteInfo, privacyNotice, startBackend } from './controllers/institute.controller.js';

await startBackend()

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});