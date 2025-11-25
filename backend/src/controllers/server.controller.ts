import { Request, Response } from "express";
import { fetchSessions } from "../db/sessions.js";

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

export async function getDashboardQueue(req: Request, res: Response): Promise<void> {
  try {
    const sessions = fetchSessions();
    let usersInQueue = 0;
    let nextInLine = 0;

    // Count applicants in queue (submitted but not served)
    sessions.forEach((session) => {
      if (
        session.applicant &&
        session.applicant.dateSubmitted &&
        !session.applicant.dateServed
      ) {
        usersInQueue++;
      }
    });

    // Calculate next in line (earliest submitted applicant)
    const applicants: Array<{ dateSubmitted: string }> = [];
    sessions.forEach((session) => {
      if (
        session.applicant &&
        session.applicant.dateSubmitted &&
        !session.applicant.dateServed
      ) {
        applicants.push({ dateSubmitted: session.applicant.dateSubmitted });
      }
    });

    if (applicants.length > 0) {
      applicants.sort((a, b) => 
        new Date(a.dateSubmitted).getTime() - new Date(b.dateSubmitted).getTime()
      );
      nextInLine = 1; // First in queue
    }

    res.json({ usersInQueue, nextInLine });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve queue data",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getActiveUsers(req: Request, res: Response): Promise<void> {
  try {
    const sessions = fetchSessions();
    const activeUsers: Array<{ sessionId: string; deviceId?: string }> = [];

    // Count active applicants (those with applicant data)
    sessions.forEach((session, sessionId) => {
      if (session.applicant) {
        activeUsers.push({
          sessionId,
          deviceId: session.deviceId,
        });
      }
    });

    res.json(activeUsers);
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve active users",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getSummary(req: Request, res: Response): Promise<void> {
  try {
    const sessions = fetchSessions();
    let requestsToday = 0;
    let totalWaitTime = 0;
    let completedRequestsCount = 0;
    let waitingRequestsCount = 0;
    let totalCurrentWaitTime = 0;

    // Get today's date at midnight for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const now = new Date();

    sessions.forEach((session) => {
      if (session.applicant && session.applicant.dateSubmitted) {
        const submittedDate = new Date(session.applicant.dateSubmitted);
        
        // Count all requests submitted today (both completed and waiting)
        if (submittedDate >= today) {
          requestsToday++;
        }

        // Calculate wait time for completed requests (served today or any day)
        if (session.applicant.dateServed) {
          const servedDate = new Date(session.applicant.dateServed);
          const waitTime = (servedDate.getTime() - submittedDate.getTime()) / (1000 * 60); // minutes
          
          // Only count valid wait times (positive and reasonable)
          if (waitTime > 0 && waitTime < 1440) { // Less than 24 hours
            totalWaitTime += waitTime;
            completedRequestsCount++;
          }
        } else {
          // For requests still waiting, calculate current wait time
          const currentWaitTime = (now.getTime() - submittedDate.getTime()) / (1000 * 60); // minutes
          if (currentWaitTime > 0 && currentWaitTime < 1440) {
            totalCurrentWaitTime += currentWaitTime;
            waitingRequestsCount++;
          }
        }
      }
    });

    // Calculate average wait time
    // If we have completed requests, use their average
    // If no completed but have waiting, use current waiting average
    // Otherwise, return 0
    let avgWaitTime = 0;
    if (completedRequestsCount > 0) {
      avgWaitTime = Math.round(totalWaitTime / completedRequestsCount);
    } else if (waitingRequestsCount > 0) {
      // If no completed requests, show average of current wait times
      avgWaitTime = Math.round(totalCurrentWaitTime / waitingRequestsCount);
    }
    
    // Calculate uptime
    const uptimeSeconds = process.uptime();
    let totalUptime = 0;
    
    if (uptimeSeconds >= 3600) {
      // Show in hours if >= 1 hour
      totalUptime = Math.round(uptimeSeconds / 3600);
    } else if (uptimeSeconds >= 60) {
      // Show in minutes if >= 1 minute (convert to decimal hours)
      totalUptime = Math.round((uptimeSeconds / 3600) * 10) / 10; // Round to 1 decimal
    } else {
      // Less than a minute, show 0
      totalUptime = 0;
    }

    res.json({
      requestsToday,
      avgWaitTime,
      totalUptime,
      // Extra data for debugging (can be removed in production)
      stats: {
        completedRequests: completedRequestsCount,
        waitingRequests: waitingRequestsCount,
        totalSessions: sessions.size,
        uptimeSeconds: Math.round(uptimeSeconds),
      }
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve summary data",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getDevices(req: Request, res: Response): Promise<void> {
  try {
    const sessions = fetchSessions();
    
    // Separate counters and applicants
    const counterDevices: Array<{
      sessionId: string;
      session: any;
      timestamp: number;
      isActive: boolean;
    }> = [];
    
    const applicantDevices: Array<{
      sessionId: string;
      session: any;
    }> = [];

    sessions.forEach((session, sessionId) => {
      if (!session.deviceId) return;

      if (session.counter) {
        // Counter device
        const timestamp = session.counter.dateOpened 
          ? new Date(session.counter.dateOpened).getTime()
          : Date.now();
        
        const isActive = !session.counter.dateClosed;
        
        counterDevices.push({
          sessionId,
          session,
          timestamp,
          isActive
        });
      } else {
        // Applicant device
        applicantDevices.push({
          sessionId,
          session
        });
      }
    });

    // Sort counters by active status first, then by timestamp
    counterDevices.sort((a, b) => {
      if (a.isActive !== b.isActive) {
        return a.isActive ? -1 : 1;
      }
      return a.timestamp - b.timestamp;
    });

    const devices: Array<{
      id: string;
      name: string;
      type: string;
      status: string;
    }> = [];

    // Add counter devices with incremental names
    counterDevices.forEach((item, index) => {
      const counterNumber = index + 1;
      const deviceName = `Counter ${counterNumber}`;
      
      let status = "Online";
      if (item.session.counter.dateClosed) {
        status = "Ended";
      } else if (item.session.cookie?.expires) {
        const expiryDate = new Date(item.session.cookie.expires);
        if (expiryDate < new Date()) {
          status = "Idle";
        }
      }

      devices.push({
        id: item.sessionId,
        name: deviceName,
        type: "Counter",
        status: status,
      });
    });

    // Add applicant devices
    applicantDevices.forEach((item) => {
      const deviceName = item.session.deviceId || "Unknown Device";
      
      let status = "Online";
      if (item.session.cookie?.expires) {
        const expiryDate = new Date(item.session.cookie.expires);
        if (expiryDate < new Date()) {
          status = "Idle";
        }
      }

      devices.push({
        id: item.sessionId,
        name: deviceName,
        type: "Applicant",
        status: status,
      });
    });

    res.json(devices);
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve devices",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
