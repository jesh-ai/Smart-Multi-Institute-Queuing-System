const { spawn } = require('child_process');

console.log('🛑 Stopping Smart Multi-Institute Queuing System...');
console.log('   - Backend API (Port 4000)');
console.log('   - Server Admin Frontend (Port 3000)');
console.log('   - Applicant Portal (Port 3001)');
console.log('   - Counter Dashboard (Port 3002)');

// Kill processes by port (backup method)
const killByPort = (port) => {
  return new Promise((resolve) => {
    const process = spawn('npx', ['kill-port', port], { shell: true });
    process.on('close', () => {
      console.log(`✅ Stopped process on port ${port}`);
      resolve();
    });
  });
};

// Stop servers on known ports
Promise.all([
  killByPort(4000), // Backend API server
  killByPort(3000), // Server frontend
  killByPort(3001), // Applicant frontend  
  killByPort(3002), // Counter frontend
  killByPort(5000), // Backend (backup port)
  killByPort(8000), // Backend (alternative port)
]).then(() => {
  console.log('🔥 All servers stopped successfully');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Error stopping servers:', error);
  process.exit(1);
});