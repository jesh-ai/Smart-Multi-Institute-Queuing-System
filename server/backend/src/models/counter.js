export class Counter {
    constructor(sessionId, createdAt, mac) {
        this.sessionId = sessionId;
        this.status = "Inactive"
        this.createdAt = createdAt;
        this.mac = mac
    }
}