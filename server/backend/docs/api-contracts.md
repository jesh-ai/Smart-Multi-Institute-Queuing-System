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
200: { "message": "Counter created", "counterId": "<counterId>" }
404: { "error": "Counter not found" }
```

---

### **PUT /counters/:id**

Update an existing counter.

**Response**

```json
200: { "message": "Counter updated", "counterId": "<counterId>" }
404: { "error": "Counter not found" }
```

---

### **DELETE /counters/:id**

Delete a counter.

**Response**

```json
200: { "message": "Counter deleted", "counterId": "<counterId>" }
404: { "error": "Counter not found" }
```

---

### **GET /counters**

Retrieve all counters.

**Response**

```json
200: [
  { "sessionId": "<sessionId>", "createdAt": "<timestamp>", "status": "active", "counter_Id": "<counterId>" }
  ...
]
```

---

### **GET /counters/:id**

Retrieve info about a specific counter.

**Response**

```json
200: { "sessionId": "<sessionId>", "createdAt": "<timestamp>", "status": "active", "counter_Id": "<counterId>" }
```

---

## Devices

### **GET /devices**

Retrieve all devices connected to the network.

**Response**

```json
200: {
  "<sessionId>": {
    "cookie": {
      "originalMaxAge": 86400000,
      "expires": "<dateTime>",
      "secure": false,
      "httpOnly": true,
      "path": "/",
      "sameSite": "lax"
    },
    "deviceId": "<devideId>",
    "dateCreated": "<dateTime>"
  },
  ...
}
```

---

## Sessions

### **GET /session**

Retrieve info about the current client session.

**Response**

```json
200: {
  "cookie": {
    "originalMaxAge": 86400000,
    "expires": "<dateTime>",
    "secure": false,
    "httpOnly": true,
    "path": "/",
    "sameSite": "lax"
  },
  "deviceId": "<devideId>",
  "dateCreated": "<dateTime>",
  "sessionId": "<sessionId>"
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