// src/server.js
import app from './app.js';
import { instituteInfo, privacyNotice, startBackend } from './controllers/institute.controller.js';

await startBackend()

const PORT = process.env.PORT || 4000;
const HOST = '0.0.0.0'; // Listen on all network interfaces

app.listen(PORT, HOST, () => {
  console.log(`Server running on:`);
  console.log(`  - Local:   http://localhost:${PORT}`);
  console.log(`  - Network: http://<your-ip>:${PORT}`);
  console.log(`\nTo access from mobile, use your computer's IP address.`);
});