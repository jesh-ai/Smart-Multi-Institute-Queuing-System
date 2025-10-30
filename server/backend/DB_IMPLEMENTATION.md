# SQLite Database Implementation - Applicant Backend

## Overview
This document details the SQLite database implementation for the applicant side of the Smart Multi-Institute Queuing System.

## Installed Dependencies
```bash
npm install better-sqlite3 uuid
```

- **better-sqlite3**: Fast, synchronous SQLite3 bindings for Node.js
- **uuid**: Generate unique session IDs

## Database Schema

Based on the official ERD: https://dbdiagram.io/d/SMART-QUEUING-SYSTEM-68cd7dbc960f6d821af5426b

### Tables Created

#### 1. **institutes**
- `institute_id` (PK, AUTOINCREMENT)
- `name` (TEXT, NOT NULL)
- `address` (TEXT)
- `created_at` (INTEGER, UNIX timestamp)

#### 2. **applicants**
- `applicant_id` (PK, AUTOINCREMENT)
- `name` (TEXT, NOT NULL)
- `contact` (TEXT, NOT NULL)
- `pii_minimized` (TEXT) - Privacy-focused minimal data storage
- `created_at` (INTEGER, UNIX timestamp)

#### 3. **forms**
- `form_id` (PK, AUTOINCREMENT)
- `institute_id` (FK → institutes)
- `version` (TEXT)
- `schema_jsonb` (TEXT, JSON) - Dynamic form schema
- `is_active` (INTEGER, boolean)
- `created_at` (INTEGER, UNIX timestamp)

#### 4. **services**
- `service_id` (PK, AUTOINCREMENT)
- `institute_id` (FK → institutes)
- `name` (TEXT, NOT NULL)
- `form_id` (FK → forms)
- `avg_service_time_sec` (INTEGER, default: 300)
- `priority_rules` (TEXT, JSON) - Priority multipliers
- `created_at` (INTEGER, UNIX timestamp)

#### 5. **sessions**
- `session_id` (PK, TEXT, UUID)
- `applicant_id` (FK → applicants)
- `institute_id` (FK → institutes, NOT NULL)
- `service_id` (FK → services)
- `ai_thread_id` (TEXT) - For AI chatbot integration
- `status` (TEXT) - 'active', 'completed', 'abandoned', 'expired'
- `created_at` (INTEGER, UNIX timestamp)
- `updated_at` (INTEGER, UNIX timestamp)

#### 6. **queue**
- `queue_id` (PK, AUTOINCREMENT)
- `session_id` (FK → sessions, UNIQUE)
- `service_id` (FK → services, NOT NULL)
- `queue_no` (TEXT, UNIQUE) - Generated queue number (e.g., "P001")
- `priority` (INTEGER, default: 0)
- `status` (TEXT) - 'waiting', 'called', 'serving', 'completed', 'cancelled', 'no_show'
- `counter_id` (INTEGER) - Assigned counter
- `created_at`, `called_at`, `served_at`, `completed_at` (INTEGER, UNIX timestamps)

#### 7. **counters**
- `counter_id` (PK, AUTOINCREMENT)
- `institute_id` (FK → institutes)
- `name` (TEXT, NOT NULL)
- `service_ids` (TEXT, JSON array) - Services this counter handles
- `status` (TEXT) - 'online', 'offline', 'busy', 'break'
- `current_queue_item_id` (FK → queue)
- `created_at` (INTEGER, UNIX timestamp)

#### 8. **audit_logs**
- `audit_log_id` (PK, AUTOINCREMENT)
- `user_id` (TEXT)
- `action` (TEXT, NOT NULL)
- `payload_jsonb` (TEXT, JSON)
- `device_info` (TEXT)
- `created_at` (INTEGER, UNIX timestamp)

#### 9. **session_responses**
- `response_id` (PK, AUTOINCREMENT)
- `session_id` (FK → sessions)
- `question_key` (TEXT, NOT NULL)
- `answer` (TEXT, NOT NULL)
- `created_at` (INTEGER, UNIX timestamp)

### Indexes Created
- `idx_sessions_status` - Fast session status lookups
- `idx_sessions_institute` - Fast institute-based session queries
- `idx_queue_status` - Fast queue status filtering
- `idx_queue_service` - Fast service-based queue queries
- `idx_queue_counter` - Fast counter assignment lookups
- `idx_services_institute` - Fast service-by-institute queries
- `idx_counters_institute` - Fast counter-by-institute queries
- `idx_audit_logs_user` - Fast user audit trail queries
- `idx_session_responses` - Fast session response lookups

## File Structure

```
server/backend/
├── applicant.db                    # SQLite database file (auto-generated)
├── src/
│   ├── config/
│   │   ├── database.js             # Database connection & initialization
│   │   └── schema.js               # Schema creation & seeding
│   ├── applicant/
│   │   ├── db/
│   │   │   ├── index.js            # Central export for all operations
│   │   │   ├── applicantOperations.js   # Applicant CRUD
│   │   │   ├── sessionOperations.js     # Session CRUD
│   │   │   ├── queueOperations.js       # Queue CRUD
│   │   │   ├── responseOperations.js    # Response CRUD
│   │   │   └── serviceOperations.js     # Service/Institute CRUD
│   │   ├── ApplicantRoutes.js
│   │   └── ApplicantMessageSend.js
│   └── server.js                   # Server entry (initializes DB on start)
```

## CRUD Operations Implemented

### Applicant Operations
- `createApplicant(name, contact, piiMinimized)`
- `getApplicant(applicantId)`
- `findApplicantByContact(contact)`
- `updateApplicant(applicantId, ...)`
- `deleteApplicant(applicantId)`

### Session Operations
- `createSession(applicantId, instituteId, serviceId, aiThreadId)`
- `getSession(sessionId)`
- `getActiveSessions()`
- `getSessionsByApplicant(applicantId)`
- `updateSessionService(sessionId, serviceId)`
- `updateSessionAIThread(sessionId, aiThreadId)`
- `updateSessionStatus(sessionId, status)`
- `touchSession(sessionId)` - Update activity timestamp
- `completeSession(sessionId)`
- `abandonSession(sessionId)`
- `deleteSession(sessionId)`
- `cleanupExpiredSessions(hoursOld)` - Utility

### Queue Operations
- `createQueueItem(sessionId, serviceId, priority)` - Auto-generates queue number
- `getQueueItem(queueId)`
- `getQueueBySession(sessionId)`
- `getQueueByNumber(queueNo)`
- `getWaitingQueue(serviceId, limit)`
- `getAllWaitingQueue(limit)`
- `callQueueItem(queueId, counterId)`
- `serveQueueItem(queueId)`
- `completeQueueItem(queueId)`
- `cancelQueueItem(queueId)`
- `markNoShow(queueId)`
- `deleteQueueItem(queueId)`
- `getQueueStats(serviceId)` - Analytics

### Response Operations
- `createResponse(sessionId, questionKey, answer)`
- `getSessionResponses(sessionId)`
- `getResponse(sessionId, questionKey)`
- `getSessionResponsesObject(sessionId)` - Returns key-value object
- `updateResponse(sessionId, questionKey, newAnswer)`
- `deleteSessionResponses(sessionId)`
- `deleteResponse(responseId)`

### Service/Institute Operations
- `createInstitute(name, address)`
- `getInstitute(instituteId)`
- `getAllInstitutes()`
- `updateInstitute(instituteId, name, address)`
- `deleteInstitute(instituteId)`
- `createService(instituteId, name, formId, avgTime, priorityRules)`
- `getService(serviceId)` - Includes form schema
- `getServicesByInstitute(instituteId)`
- `getAllServices()`
- `updateService(serviceId, ...)`
- `deleteService(serviceId)`

## Initialization Flow

1. Server starts → `src/server.js`
2. Imports `initializeSchema()` and `seedInitialData()` from `src/config/schema.js`
3. Database connection established via `src/config/database.js`
4. Schema checked/created (IF NOT EXISTS pattern - safe for restarts)
5. Initial data seeded:
   - 1 Institute: "Department of Foreign Affairs"
   - 1 Form: Dynamic form schema with 4 fields
   - 4 Services: Passport Application, Passport Renewal, Record Certification, Clearance
6. Server starts listening on port 4000

## Security Features

- **Foreign Keys Enabled**: Data integrity enforced
- **CASCADE DELETE**: Automatic cleanup of related records
- **PII Minimization**: Dedicated field for privacy-focused data storage
- **Audit Logs**: Track all user actions with payloads
- **Input Validation**: CRUD operations include error handling

## Seeded Data

### Default Institute: DFA
- **Name**: Department of Foreign Affairs
- **Address**: DFA Building, Roxas Boulevard, Manila

### Default Services:
1. **Passport Application** - 15 min avg, priority rules for senior/PWD/pregnant
2. **Passport Renewal** - 10 min avg, priority rules for senior/PWD
3. **Record Certification** - 5 min avg
4. **Clearance** - 7.5 min avg

### Sample Form Schema:
```json
{
  "fields": [
    { "key": "full_name", "label": "Full Name", "type": "text", "required": true },
    { "key": "birth_date", "label": "Date of Birth", "type": "date", "required": true },
    { "key": "contact_number", "label": "Contact Number", "type": "tel", "required": true },
    { "key": "email", "label": "Email Address", "type": "email", "required": false }
  ]
}
```

## Testing Performed

- [x] Database file created: `applicant.db`
- [x] Schema initialization successful
- [x] Seed data inserted correctly
- [x] Server starts without errors
- [x] All tables created with proper constraints
- [x] All indexes created
- [x] Foreign key relationships enforced

## Next Steps

1. **Integrate with ApplicantMessageSend.js**
   - Create/retrieve sessions on chatbot start
   - Store responses during conversation
   - Generate queue numbers on completion

2. **Add Audit Logging**
   - Log all chatbot interactions
   - Track user actions

3. **Implement AI Integration**
   - Store AI thread IDs in sessions
   - Link AI responses with session context

4. **Add API Endpoints**
   - GET `/api/queue/:queueNo` - Check queue status
   - GET `/api/services` - List available services
   - POST `/api/session` - Start new session

5. **Add Data Validation**
   - Input sanitization
   - Business logic validation

## Notes

- All timestamps stored as UNIX epoch (seconds)
- Queue numbers auto-generated with prefix (e.g., "P001" for Passport)
- Session status managed through state machine (active → completed/abandoned/expired)
- Database uses better-sqlite3 (synchronous, fast, embedded)

## Maintenance

### Cleanup Old Sessions
```javascript
import { cleanupExpiredSessions } from './src/applicant/db/index.js';
cleanupExpiredSessions(24); // Expire sessions older than 24 hours
```

### View Queue Statistics
```javascript
import { getQueueStats } from './src/applicant/db/index.js';
const stats = getQueueStats(); // All services
const serviceStats = getQueueStats(1); // Specific service
```

---

**Database Location**: `server/backend/applicant.db`
**Last Updated**: October 31, 2025
**Status**: Ready for Integration
