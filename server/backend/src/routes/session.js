import { Session } from "../models/session.js";
import arp from "node-arp";

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

  const session = new Session(ip, mac);
  res.json(session);
};