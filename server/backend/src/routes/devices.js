import express from "express";
import ping from "ping";
import arp from "node-arp";
import os from "os"

const subnet = "192.168.1";
export const results = new Map(); 

export function getLocalMac() {
  const interfaces = os.networkInterfaces();
  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if (!iface.internal && iface.mac && iface.mac !== "00:00:00:00:00:00") {
        return iface.mac;
      }
    }
  }
  return "unknown";
}
async function scanNetwork() {
  for (let i = 1; i <= 253; i++) {
    const ip = `${subnet}.${i}`;
    const res = await ping.promise.probe(ip, { timeout: 1 });
    if (res.alive) {
      await new Promise(resolve => {
        arp.getMAC(ip, (err, macAddr) => {
          const mac = macAddr || "unknown";
          const time = new Date().toLocaleTimeString();
          const host = res.host || "unknown";

          results.set(ip, { ip, mac, host, time });
          resolve();
        });
      });
    }
  }
}

(async function loopScan() {
  while (true) {
    await scanNetwork();
    await new Promise(r => setTimeout(r, 5000)); 
  }
})();
