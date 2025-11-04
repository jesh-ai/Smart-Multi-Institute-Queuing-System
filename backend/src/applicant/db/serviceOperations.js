// CRUD operations for Services and Institutes
import db from "../../config/database.js";

// ============ INSTITUTES ============

// CREATE - Add new institute
export function createInstitute(name, address = null) {
  const stmt = db.prepare(`
    INSERT INTO institutes (name, address)
    VALUES (?, ?)
  `);

  try {
    const info = stmt.run(name, address);
    return { success: true, instituteId: info.lastInsertRowid };
  } catch (error) {
    console.error("Error creating institute:", error);
    return { success: false, error: error.message };
  }
}

// READ - Get institute by ID
export function getInstitute(instituteId) {
  const stmt = db.prepare(`
    SELECT * FROM institutes WHERE institute_id = ?
  `);

  try {
    return stmt.get(instituteId) || null;
  } catch (error) {
    console.error("Error getting institute:", error);
    return null;
  }
}

// READ - Get all institutes
export function getAllInstitutes() {
  const stmt = db.prepare(`
    SELECT * FROM institutes ORDER BY name ASC
  `);

  try {
    return stmt.all();
  } catch (error) {
    console.error("Error getting all institutes:", error);
    return [];
  }
}

// UPDATE - Update institute
export function updateInstitute(instituteId, name, address) {
  const stmt = db.prepare(`
    UPDATE institutes 
    SET name = ?, address = ?
    WHERE institute_id = ?
  `);

  try {
    const info = stmt.run(name, address, instituteId);
    return { success: info.changes > 0 };
  } catch (error) {
    console.error("Error updating institute:", error);
    return { success: false, error: error.message };
  }
}

// DELETE - Delete institute
export function deleteInstitute(instituteId) {
  const stmt = db.prepare(`
    DELETE FROM institutes WHERE institute_id = ?
  `);

  try {
    const info = stmt.run(instituteId);
    return { success: info.changes > 0 };
  } catch (error) {
    console.error("Error deleting institute:", error);
    return { success: false, error: error.message };
  }
}

// ============ SERVICES ============

// CREATE - Add new service
export function createService(instituteId, name, formId = null, avgServiceTimeSec = 300, priorityRules = null) {
  const stmt = db.prepare(`
    INSERT INTO services (institute_id, name, form_id, avg_service_time_sec, priority_rules)
    VALUES (?, ?, ?, ?, ?)
  `);

  try {
    const info = stmt.run(instituteId, name, formId, avgServiceTimeSec, priorityRules);
    return { success: true, serviceId: info.lastInsertRowid };
  } catch (error) {
    console.error("Error creating service:", error);
    return { success: false, error: error.message };
  }
}

// READ - Get service by ID
export function getService(serviceId) {
  const stmt = db.prepare(`
    SELECT 
      s.*,
      i.name as institute_name,
      i.address as institute_address,
      f.schema_jsonb as form_schema
    FROM services s
    JOIN institutes i ON s.institute_id = i.institute_id
    LEFT JOIN forms f ON s.form_id = f.form_id AND f.is_active = 1
    WHERE s.service_id = ?
  `);

  try {
    return stmt.get(serviceId) || null;
  } catch (error) {
    console.error("Error getting service:", error);
    return null;
  }
}

// READ - Get all services for an institute
export function getServicesByInstitute(instituteId) {
  const stmt = db.prepare(`
    SELECT 
      s.*,
      f.schema_jsonb as form_schema
    FROM services s
    LEFT JOIN forms f ON s.form_id = f.form_id AND f.is_active = 1
    WHERE s.institute_id = ?
    ORDER BY s.name ASC
  `);

  try {
    return stmt.all(instituteId);
  } catch (error) {
    console.error("Error getting services by institute:", error);
    return [];
  }
}

// READ - Get all services
export function getAllServices() {
  const stmt = db.prepare(`
    SELECT 
      s.*,
      i.name as institute_name,
      f.schema_jsonb as form_schema
    FROM services s
    JOIN institutes i ON s.institute_id = i.institute_id
    LEFT JOIN forms f ON s.form_id = f.form_id AND f.is_active = 1
    ORDER BY i.name ASC, s.name ASC
  `);

  try {
    return stmt.all();
  } catch (error) {
    console.error("Error getting all services:", error);
    return [];
  }
}

// UPDATE - Update service
export function updateService(serviceId, name, formId, avgServiceTimeSec, priorityRules) {
  const stmt = db.prepare(`
    UPDATE services 
    SET name = ?, 
        form_id = ?, 
        avg_service_time_sec = ?,
        priority_rules = ?
    WHERE service_id = ?
  `);

  try {
    const info = stmt.run(name, formId, avgServiceTimeSec, priorityRules, serviceId);
    return { success: info.changes > 0 };
  } catch (error) {
    console.error("Error updating service:", error);
    return { success: false, error: error.message };
  }
}

// DELETE - Delete service
export function deleteService(serviceId) {
  const stmt = db.prepare(`
    DELETE FROM services WHERE service_id = ?
  `);

  try {
    const info = stmt.run(serviceId);
    return { success: info.changes > 0 };
  } catch (error) {
    console.error("Error deleting service:", error);
    return { success: false, error: error.message };
  }
}
