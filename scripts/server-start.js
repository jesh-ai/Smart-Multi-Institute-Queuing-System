const { spawn } = require('child_process');

console.log('🚀 Starting Smart Multi-Institute Queuing System...');

// Start backend server
console.log('📡 Starting backend server...');
const backend = spawn('npm', ['run', 'dev'], {
  cwd: './backend',
  stdio: 'inherit',
  shell: true
});

// Start all frontend servers
console.log('🌐 Starting all frontend servers...');
console.log('  - Server Admin Frontend (Port 3000)');
console.log('  - Applicant Portal (Port 3001)');
console.log('  - Counter Dashboard (Port 3002)');

const frontendServer = spawn('npm', ['run', 'dev:server'], {
  cwd: './frontend',
  stdio: 'inherit', 
  shell: true
});

const frontendApplicant = spawn('npm', ['run', 'dev:applicant'], {
  cwd: './frontend',
  stdio: 'inherit', 
  shell: true
});

const frontendCounter = spawn('npm', ['run', 'dev:counter'], {
  cwd: './frontend',
  stdio: 'inherit', 
  shell: true
});

// Wait a bit for servers to start then open browser
setTimeout(async () => {
  try {
    console.log('🌐 Opening server admin frontend in browser...');
    console.log('📝 Other frontends available at:');
    console.log('   - Applicant Portal: http://localhost:3001');
    console.log('   - Counter Dashboard: http://localhost:3002');
    const { default: open } = await import('open');
    await open('http://localhost:3000');
  } catch (error) {
    console.log('Could not auto-open browser. Please manually open: http://localhost:3000');
    console.log('Other frontends available at:');
    console.log('   - Applicant Portal: http://localhost:3001');
    console.log('   - Counter Dashboard: http://localhost:3002');
    console.log('Error:', error.message);
  }
}, 10000); // Increased timeout to 10 seconds for all servers

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down all servers...');
  backend.kill('SIGINT');
  frontendServer.kill('SIGINT');
  frontendApplicant.kill('SIGINT');
  frontendCounter.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down all servers...');
  backend.kill('SIGTERM');
  frontendServer.kill('SIGTERM');
  frontendApplicant.kill('SIGTERM');
  frontendCounter.kill('SIGTERM');
  process.exit(0);
});