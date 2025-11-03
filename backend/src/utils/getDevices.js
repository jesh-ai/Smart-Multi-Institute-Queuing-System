import ping from "ping";
import os from "os";
import arp from "node-arp";

export function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
}

export async function scanNetwork() {
  const subnet = "192.168.1"; 
  const results = [];

  for (let i = 1; i <= 253; i++) {
    const ip = `${subnet}.${i}`;
    const res = await ping.promise.probe(ip, { timeout: 1 });

    if (res.alive) {
      const timestamp = new Date().toLocaleString();
      let mac = "unknown";
      
      await new Promise(resolve => {
        arp.getMAC(ip, async (err, macAddr) => {
          mac = macAddr || "unknown";
          results.push({
            ip,
            mac,
            host: res.host || "unknown",
            time: timestamp,
          });
          resolve();
        });
      });
    }
  }
}