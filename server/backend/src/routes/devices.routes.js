
import ping from "ping";
import arp from "node-arp";
import os from "os"
import { Session } from "../models/session.js";
import { randomUUID } from "crypto";
import { fetchSessions, storeSession } from "../db/sessions.js";

const subnet = "192.168.1";
const duration =  12 * 60 * 60

export function getLocalMac() {
  const interfaces = os.networkInterfaces();
  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if (!iface.internal && iface.mac && iface.mac !== "00:00:00:00:00:00") {
        return iface.mac;
      }
    }
  }
  return "";
}
export async function getDeviceMac(req) {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress?.replace("::ffff:", "") ||
    "";

  if (ip === "") return "";

  return new Promise(resolve => {
    arp.getMAC(ip, (err, macAddr) => {
      resolve(macAddr || "");
    });
  });
}
export async function scanNetwork() {
  for (let i = 1; i <= 25; i++) {
    const ip = `${subnet}.${i}`;
    const res = await ping.promise.probe(ip, { timeout: 1 });
    if (res.alive) {
      await new Promise(resolve => {
        arp.getMAC(ip, (err, macAddr) => {
          const mac = macAddr || "";
          const results = fetchSessions()
          let session = results.get(mac)
          const expired = Date.now() - new Date(session?.dateCreated).getTime() >= duration * 1000
          if (!session || expired ) {
            session = new Session(ip, mac, randomUUID(), "applicant" )
            storeSession(mac, session);
          } 

          resolve();
        });
      });
    }
  }
}

