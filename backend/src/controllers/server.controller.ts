import { Request, Response } from "express";

export async function getIsServer(req: Request, res: Response): Promise<void> {
  const serverIp = req.socket.localAddress?.replace("::ffff:", "") || "unknown";
  const forwardedFor = req.headers["x-forwarded-for"];
  const clientIp = (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor?.split(",")[0]) ||
  req.socket.remoteAddress?.replace("::ffff:", "") ||
  "unknown";
  console.warn("Server IP:", serverIp, "Client IP:", clientIp);
  res.json({ isServer: serverIp == clientIp });
}

export async function shutdownServer(req: Request, res: Response): Promise<void> {
  console.log("Server shutdown requested");
  res.json({ message: "Server shutting down..." });
  
  // Give time for response to be sent
  setTimeout(() => {
    console.log("Server shutting down now");
    process.exit(0);
  }, 1000);
}
