// CRUD operations for Queue
import db from "../../config/database.js";

// Helper function to generate queue number
function generateQueueNumber(serviceId) {
  // Get service info to create prefix
  const service = db.prepare(`
    SELECT s.name, i.name as institute_name 
    FROM services s 
    JOIN institutes i ON s.institute_id = i.institute_id 
    WHERE s.service_id = ?
  `).get(serviceId);

  if (!service) return null;

  // Get today's count for this service
  const todayStart = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000);
  const count = db.prepare(`
    SELECT COUNT(*) as count 
    FROM queue 
    WHERE service_id = ? AND created_at >= ?
  `).get(serviceId, todayStart);

  // Create queue number: A001, A002, etc.
  const prefix = service.name.charAt(0).toUpperCase();
  const number = String((count?.count || 0) + 1).padStart(3, '0');
  
  return `${prefix}${number}`;
}

// CREATE - Add to queue
export function createQueueItem(sessionId, serviceId, priority = 0) {
  const queueNo = generateQueueNumber(serviceId);
  
  if (!queueNo) {
    return { success: false, error: "Invalid service ID" };
  }

  const stmt = db.prepare(`
    INSERT INTO queue (session_id, service_id, queue_no, priority, status)
    VALUES (?, ?, ?, ?, 'waiting')
  `);

  try {
    const info = stmt.run(sessionId, serviceId, queueNo, priority);
    return { success: true, queueId: info.lastInsertRowid, queueNo };
  } catch (error) {
    console.error("Error creating queue item:", error);
    return { success: false, error: error.message };
  }
}

// READ - Get queue item by ID
export function getQueueItem(queueId) {
  const stmt = db.prepare(`
    SELECT 
      q.*,
      s.name as service_name,
      i.name as institute_name,
      ses.applicant_id
    FROM queue q
    JOIN services s ON q.service_id = s.service_id
    JOIN institutes i ON s.institute_id = i.institute_id
    JOIN sessions ses ON q.session_id = ses.session_id
    WHERE q.queue_id = ?
  `);

  try {
    return stmt.get(queueId) || null;
  } catch (error) {
    console.error("Error getting queue item:", error);
    return null;
  }
}

// READ - Get queue item by session
export function getQueueBySession(sessionId) {
  const stmt = db.prepare(`
    SELECT 
      q.*,
      s.name as service_name,
      i.name as institute_name
    FROM queue q
    JOIN services s ON q.service_id = s.service_id
    JOIN institutes i ON s.institute_id = i.institute_id
    WHERE q.session_id = ?
  `);

  try {
    return stmt.get(sessionId) || null;
  } catch (error) {
    console.error("Error getting queue by session:", error);
    return null;
  }
}

// READ - Get queue item by queue number
export function getQueueByNumber(queueNo) {
  const stmt = db.prepare(`
    SELECT 
      q.*,
      s.name as service_name,
      i.name as institute_name,
      ses.applicant_id
    FROM queue q
    JOIN services s ON q.service_id = s.service_id
    JOIN institutes i ON s.institute_id = i.institute_id
    JOIN sessions ses ON q.session_id = ses.session_id
    WHERE q.queue_no = ?
  `);

  try {
    return stmt.get(queueNo) || null;
  } catch (error) {
    console.error("Error getting queue by number:", error);
    return null;
  }
}

// READ - Get waiting queue for a service
export function getWaitingQueue(serviceId, limit = 50) {
  const stmt = db.prepare(`
    SELECT 
      q.*,
      s.name as service_name,
      i.name as institute_name
    FROM queue q
    JOIN services s ON q.service_id = s.service_id
    JOIN institutes i ON s.institute_id = i.institute_id
    WHERE q.service_id = ? AND q.status = 'waiting'
    ORDER BY q.priority DESC, q.created_at ASC
    LIMIT ?
  `);

  try {
    return stmt.all(serviceId, limit);
  } catch (error) {
    console.error("Error getting waiting queue:", error);
    return [];
  }
}

// READ - Get all waiting queue items (all services)
export function getAllWaitingQueue(limit = 100) {
  const stmt = db.prepare(`
    SELECT 
      q.*,
      s.name as service_name,
      i.name as institute_name
    FROM queue q
    JOIN services s ON q.service_id = s.service_id
    JOIN institutes i ON s.institute_id = i.institute_id
    WHERE q.status = 'waiting'
    ORDER BY q.priority DESC, q.created_at ASC
    LIMIT ?
  `);

  try {
    return stmt.all(limit);
  } catch (error) {
    console.error("Error getting all waiting queue:", error);
    return [];
  }
}

// UPDATE - Call queue item
export function callQueueItem(queueId, counterId) {
  const stmt = db.prepare(`
    UPDATE queue 
    SET status = 'called', 
        counter_id = ?,
        called_at = strftime('%s', 'now')
    WHERE queue_id = ? AND status = 'waiting'
  `);

  try {
    const info = stmt.run(counterId, queueId);
    return { success: info.changes > 0 };
  } catch (error) {
    console.error("Error calling queue item:", error);
    return { success: false, error: error.message };
  }
}

// UPDATE - Start serving queue item
export function serveQueueItem(queueId) {
  const stmt = db.prepare(`
    UPDATE queue 
    SET status = 'serving',
        served_at = strftime('%s', 'now')
    WHERE queue_id = ? AND status = 'called'
  `);

  try {
    const info = stmt.run(queueId);
    return { success: info.changes > 0 };
  } catch (error) {
    console.error("Error serving queue item:", error);
    return { success: false, error: error.message };
  }
}

// UPDATE - Complete queue item
export function completeQueueItem(queueId) {
  const stmt = db.prepare(`
    UPDATE queue 
    SET status = 'completed',
        completed_at = strftime('%s', 'now')
    WHERE queue_id = ? AND status IN ('called', 'serving')
  `);

  try {
    const info = stmt.run(queueId);
    return { success: info.changes > 0 };
  } catch (error) {
    console.error("Error completing queue item:", error);
    return { success: false, error: error.message };
  }
}

// UPDATE - Cancel queue item
export function cancelQueueItem(queueId) {
  const stmt = db.prepare(`
    UPDATE queue 
    SET status = 'cancelled'
    WHERE queue_id = ? AND status = 'waiting'
  `);

  try {
    const info = stmt.run(queueId);
    return { success: info.changes > 0 };
  } catch (error) {
    console.error("Error cancelling queue item:", error);
    return { success: false, error: error.message };
  }
}

// UPDATE - Mark as no show
export function markNoShow(queueId) {
  const stmt = db.prepare(`
    UPDATE queue 
    SET status = 'no_show'
    WHERE queue_id = ? AND status = 'called'
  `);

  try {
    const info = stmt.run(queueId);
    return { success: info.changes > 0 };
  } catch (error) {
    console.error("Error marking no show:", error);
    return { success: false, error: error.message };
  }
}

// DELETE - Remove from queue (hard delete)
export function deleteQueueItem(queueId) {
  const stmt = db.prepare(`
    DELETE FROM queue WHERE queue_id = ?
  `);

  try {
    const info = stmt.run(queueId);
    return { success: info.changes > 0 };
  } catch (error) {
    console.error("Error deleting queue item:", error);
    return { success: false, error: error.message };
  }
}

// UTILITY - Get queue statistics
export function getQueueStats(serviceId = null) {
  let query = `
    SELECT 
      status,
      COUNT(*) as count,
      AVG(CASE 
        WHEN completed_at IS NOT NULL THEN completed_at - created_at 
        ELSE NULL 
      END) as avg_duration
    FROM queue
  `;

  if (serviceId) {
    query += ` WHERE service_id = ?`;
  }

  query += ` GROUP BY status`;

  const stmt = db.prepare(query);

  try {
    return serviceId ? stmt.all(serviceId) : stmt.all();
  } catch (error) {
    console.error("Error getting queue stats:", error);
    return [];
  }
}
