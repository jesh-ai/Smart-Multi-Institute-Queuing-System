// Database configuration and initialization
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Database path - stored in backend root
const DB_PATH = path.join(__dirname, "../../applicant.db");
// Ensure database directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}
// Initialize database connection
const db = new Database(DB_PATH, { verbose: console.log });
// Enable foreign keys
db.pragma("foreign_keys = ON");
export default db;
