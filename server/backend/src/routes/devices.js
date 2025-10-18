import express from "express";
import ping from "ping";
import arp from "node-arp";

const app = express();
const subnet = "192.168.1";
export const results = new Map(); 

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
