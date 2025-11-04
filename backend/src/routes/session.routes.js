
import arp from "node-arp";
import { fetchSessions } from "../db/sessions.js";

export async function getCurrentSession(req, res) {

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress?.replace("::ffff:", "") ||
    "unknown";

  let mac = "unknown";
  await new Promise(resolve => {
    arp.getMAC(ip, (err, macAddr) => {
      mac = macAddr || "unknown";
      resolve();
    });
  });

  const results = fetchSessions()
  const session = results.get(mac);
  res.json(session);
};