# Smart Queue API Contract

## Overview

Central API for managing applicants, counters, devices, and sessions.

## Base URL

```
http://192.168.1.6:4000/api
```

---

## Counters

### **POST /counters**

Add a new counter to the database session management.

**Response**

```json
200: { "message": "Counter created", "sessionId": "<uuid>" }
404: { "error": "Counter not found" }
```

---

### **PUT /counters/:id**

Update an existing counter.

**Response**

```json
200: { "message": "Counter updated", "sessionId": "<uuid>" }
404: { "error": "Counter not found" }
```

---

### **DELETE /counters/:id**

Delete a counter.

**Response**

```json
200: { "message": "Counter deleted", "sessionId": "<uuid>" }
404: { "error": "Counter not found" }
```

---

### **GET /counters**

Retrieve all counters.

**Response**

```json
200: [
  { "sessionId": "<uuid>", "createdAt": "<timestamp>", "status": "active", "mac": "<mac-address>" }
]
```

---

### **GET /counters/:id**

Retrieve info about a specific counter.

**Response**

```json
200: { "sessionId": "<uuid>", "createdAt": "<timestamp>", "status": "active", "mac": "<mac-address>" }
```

---

## Devices

### **GET /devices**

Retrieve all devices connected to the network.

**Response**

```json
200: [
  {
    "dateCreated": "10/24/2025, 5:22:21 PM",
    "userType": "applicant",
    "sessionId": "9f4eb5f8-fad8-4487-ae47-199bf9e0b5dc",
    "ip": "192.168.1.1",
    "mac": "6c:67:ef:09:02:04"
  },
  ...
]
```

---

## Sessions

### **GET /session**

Retrieve info about the current client session.

**Response**

```json
200: {
  "dateCreated": "10/24/2025, 5:22:21 PM",
  "userType": "applicant",
  "sessionId": "9f4eb5f8-fad8-4487-ae47-199bf9e0b5dc",
  "ip": "192.168.1.1",
  "mac": "6c:67:ef:09:02:04"
}
```

---

## Server

### **GET /server/check**

Check if the client is the server.

**Response**

```json
200: { "isServer": true }
```