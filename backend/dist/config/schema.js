// Database schema initialization
import db from "./database.js";
export function initializeSchema() {
    console.log("Initializing database schema...");
    // Institutes table - institution/organization information
    db.exec(`
    CREATE TABLE IF NOT EXISTS institutes (
      institute_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT,
      created_at INTEGER DEFAULT (strftime('%s', 'now'))
    )
  `);
    // Applicants table - PII minimized applicant data
    db.exec(`
    CREATE TABLE IF NOT EXISTS applicants (
      applicant_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      contact TEXT NOT NULL,
      pii_minimized TEXT,
      created_at INTEGER DEFAULT (strftime('%s', 'now'))
    )
  `);
    // Forms table - dynamic form schemas per institute
    db.exec(`
    CREATE TABLE IF NOT EXISTS forms (
      form_id INTEGER PRIMARY KEY AUTOINCREMENT,
      institute_id INTEGER NOT NULL,
      version TEXT NOT NULL,
      schema_jsonb TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY (institute_id) REFERENCES institutes(institute_id) ON DELETE CASCADE
    )
  `);
    // Services table - services offered by institutes
    db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      service_id INTEGER PRIMARY KEY AUTOINCREMENT,
      institute_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      form_id INTEGER,
      avg_service_time_sec INTEGER DEFAULT 300,
      priority_rules TEXT,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY (institute_id) REFERENCES institutes(institute_id) ON DELETE CASCADE,
      FOREIGN KEY (form_id) REFERENCES forms(form_id) ON DELETE SET NULL
    )
  `);
    // Sessions table - applicant chat sessions with AI
    db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      session_id TEXT PRIMARY KEY,
      applicant_id INTEGER,
      institute_id INTEGER NOT NULL,
      service_id INTEGER,
      ai_thread_id TEXT,
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'completed', 'abandoned', 'expired')),
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      updated_at INTEGER DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY (applicant_id) REFERENCES applicants(applicant_id) ON DELETE SET NULL,
      FOREIGN KEY (institute_id) REFERENCES institutes(institute_id) ON DELETE CASCADE,
      FOREIGN KEY (service_id) REFERENCES services(service_id) ON DELETE SET NULL
    )
  `);
    // Queue table - queue management system
    db.exec(`
    CREATE TABLE IF NOT EXISTS queue (
      queue_id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL UNIQUE,
      service_id INTEGER NOT NULL,
      queue_no TEXT NOT NULL UNIQUE,
      priority INTEGER DEFAULT 0,
      status TEXT DEFAULT 'waiting' CHECK(status IN ('waiting', 'called', 'serving', 'completed', 'cancelled', 'no_show')),
      counter_id INTEGER,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      called_at INTEGER,
      served_at INTEGER,
      completed_at INTEGER,
      FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE,
      FOREIGN KEY (service_id) REFERENCES services(service_id) ON DELETE CASCADE
    )
  `);
    // Counters table - service counter information
    db.exec(`
    CREATE TABLE IF NOT EXISTS counters (
      counter_id INTEGER PRIMARY KEY AUTOINCREMENT,
      institute_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      service_ids TEXT NOT NULL,
      status TEXT DEFAULT 'offline' CHECK(status IN ('online', 'offline', 'busy', 'break')),
      current_queue_item_id INTEGER,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY (institute_id) REFERENCES institutes(institute_id) ON DELETE CASCADE,
      FOREIGN KEY (current_queue_item_id) REFERENCES queue(queue_id) ON DELETE SET NULL
    )
  `);
    // Audit logs table - track all user actions
    db.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      audit_log_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      action TEXT NOT NULL,
      payload_jsonb TEXT,
      device_info TEXT,
      created_at INTEGER DEFAULT (strftime('%s', 'now'))
    )
  `);
    // Session responses table - store applicant answers during session
    db.exec(`
    CREATE TABLE IF NOT EXISTS session_responses (
      response_id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      question_key TEXT NOT NULL,
      answer TEXT NOT NULL,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE
    )
  `);
    // Create indexes for better performance
    db.exec(`
    CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
    CREATE INDEX IF NOT EXISTS idx_sessions_institute ON sessions(institute_id);
    CREATE INDEX IF NOT EXISTS idx_queue_status ON queue(status);
    CREATE INDEX IF NOT EXISTS idx_queue_service ON queue(service_id);
    CREATE INDEX IF NOT EXISTS idx_queue_counter ON queue(counter_id);
    CREATE INDEX IF NOT EXISTS idx_services_institute ON services(institute_id);
    CREATE INDEX IF NOT EXISTS idx_counters_institute ON counters(institute_id);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
    CREATE INDEX IF NOT EXISTS idx_session_responses ON session_responses(session_id);
  `);
    console.log("Database schema initialized successfully!");
}
// Seed initial data
export function seedInitialData() {
    console.log("Seeding initial data...");
    // Check if institutes already exist
    const instituteCount = db.prepare("SELECT COUNT(*) as count FROM institutes").get();
    if (instituteCount.count === 0) {
        // Insert sample institute
        const insertInstitute = db.prepare(`
      INSERT INTO institutes (name, address) VALUES (?, ?)
    `);
        const info = insertInstitute.run("Department of Foreign Affairs", "DFA Building, Roxas Boulevard, Manila");
        const instituteId = info.lastInsertRowid;
        // Insert sample form schema
        const insertForm = db.prepare(`
      INSERT INTO forms (institute_id, version, schema_jsonb, is_active)
      VALUES (?, ?, ?, ?)
    `);
        const formSchema = JSON.stringify({
            fields: [
                { key: "full_name", label: "Full Name", type: "text", required: true },
                { key: "birth_date", label: "Date of Birth", type: "date", required: true },
                { key: "contact_number", label: "Contact Number", type: "tel", required: true },
                { key: "email", label: "Email Address", type: "email", required: false }
            ]
        });
        const formInfo = insertForm.run(instituteId, "1.0", formSchema, 1);
        const formId = formInfo.lastInsertRowid;
        // Insert sample services
        const insertService = db.prepare(`
      INSERT INTO services (institute_id, name, form_id, avg_service_time_sec, priority_rules)
      VALUES (?, ?, ?, ?, ?)
    `);
        insertService.run(instituteId, "Passport Application", formId, 900, // 15 minutes
        JSON.stringify({ senior_citizen: 2, pwd: 2, pregnant: 1.5 }));
        insertService.run(instituteId, "Passport Renewal", formId, 600, // 10 minutes
        JSON.stringify({ senior_citizen: 2, pwd: 2 }));
        insertService.run(instituteId, "Record Certification", formId, 300, // 5 minutes
        null);
        insertService.run(instituteId, "Clearance", formId, 450, // 7.5 minutes
        null);
        console.log(`Seeded institute with ${formInfo.changes} forms and services`);
    }
    console.log("Initial data seeding complete!");
}
