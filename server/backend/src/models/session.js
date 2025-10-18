import { randomUUID } from "crypto";

export class Session {
  constructor(ip, mac, userType = "applicant") {
    this.dateCreated = new Date().toLocaleString();
    this.userType = userType;
    this.sessionId = randomUUID();
    this.ip = ip;
    this.mac = mac;
  }
}