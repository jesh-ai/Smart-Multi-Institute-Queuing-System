## 🔧 Development

### Development Mode

```bash
npm run dev
```

This starts both frontend and backend in development mode with hot reload.

### Individual Services

Start backend only:

```bash
cd backend && npm run dev
```

Start specific frontend:

```bash
cd frontend && npm run dev:server    # Server admin (port 3000)
cd frontend && npm run dev:applicant # Applicant portal (port 3001)
cd frontend && npm run dev:counter   # Counter dashboard (port 3002)
```

## 🌐 Frontend Applications

### Server Admin Frontend (Port 3000)

- **Path:** `/frontend/server/`
- **Features:** System management, queue monitoring, settings
- **Shutdown:** Available in Settings page

### Applicant Portal (Port 3001)

- **Path:** `/frontend/applicant/`
- **Features:** Chat interface, form filling, status checking

### Counter Dashboard (Port 3002)

- **Path:** `/frontend/counter/`
- **Features:** Queue processing, applicant management

## 🚦 Server Management

### Ports Configuration

- **Backend API**: `http://localhost:4000` - Serves all API endpoints and data templates
- **Server Frontend**: `http://localhost:3000` - Admin dashboard (auto-opens on startup)
- **Applicant Frontend**: `http://localhost:3001` - Customer portal
- **Counter Frontend**: `http://localhost:3002` - Staff dashboard

### Mobile/Network Access Setup

To access the application from mobile devices or other computers on your network:

1. **Find your computer's IP address:**

   ```bash
   ipconfig | Select-String "IPv4"
   ```

   Look for your active network adapter (e.g., `192.168.1.5`)

2. **Update applicant frontend environment:**

   - Create/edit `frontend/applicant/.env.local`
   - Set: `NEXT_PUBLIC_API_URL=http://YOUR_IP:4000`
   - Replace `YOUR_IP` with your computer's IP address

3. **Restart services:**

   ```bash
   npm run server:stop
   npm run server:start
   ```

4. **Access from mobile device:**
   - Ensure mobile is on the same WiFi network
   - Navigate to: `http://YOUR_IP:3001`

### Automatic Startup

The `npm run server:start` command will:

1. Start the backend server (port 4000)
2. Start the server frontend (port 3000)
3. Open the browser to the server admin page
4. Provide coordinated shutdown via API

### Manual Shutdown

- Use the shutdown button in the server frontend settings
- Or run `npm run server:stop`
- Or use Ctrl+C in the terminal

## 📝 Scripts Reference

```bash
# Root level
npm run install-all      # Install all dependencies
npm run dev             # Start everything in dev mode
npm run start           # Start everything in production mode
npm run server:start    # Smart server startup with browser opening
npm run server:stop     # Clean shutdown of all services

# Frontend workspace
npm run dev:server      # Server admin frontend
npm run dev:applicant   # Applicant portal
npm run dev:counter     # Counter dashboard

# Backend
npm run dev             # Development with nodemon
npm start               # Production start
```
