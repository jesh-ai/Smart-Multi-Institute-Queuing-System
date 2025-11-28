import { Request, Response } from "express";
import { fetchSessions } from "../db/sessions.js";
import { getAvailableKeys } from "../utils/counterKeys.js";

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

    const applicants = Array.from(sessions).filter(s => {
      const isApplicant = s[1].applicant != undefined
      const isClosed = s[1].applicant?.dateClosed == undefined

      return isApplicant && isClosed
    })
    const sortedApplicants = applicants.sort((a, b) => {
      const x = a[1].applicant
      const y = b[1].applicant
      return new Date(x?.dateSubmitted || 0).getTime() - new Date(y?.dateSubmitted || 0).getTime()
    })
    
    const lastSession = sortedApplicants.length > 0 ? sortedApplicants[sortedApplicants.length - 1][1].applicant?.name : undefined

    const usersInQueue = applicants.length
    res.json({ usersInQueue, lastSession });
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

    const serverStartTime = Date.now() - (process.uptime() * 1000);
    const applicants = Array.from(sessions).filter(s => {
      const isApplicant = s[1].applicant != undefined
      const isClosed = s[1].applicant?.dateClosed == undefined
      const dateSubmitted = s[1].applicant?.dateSubmitted
      const isAfterServerStart = dateSubmitted ? new Date(dateSubmitted).getTime() >= serverStartTime : false

      return isApplicant && isClosed && isAfterServerStart
    })

    
    res.json(applicants.length);
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
        if (session.applicant.dateClosed) {
          const servedDate = new Date(session.applicant.dateClosed);
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

    let avgWaitTime = 0;
    if (completedRequestsCount > 0) {
      avgWaitTime = Math.round(totalWaitTime / completedRequestsCount);
    } else if (waitingRequestsCount > 0) {
      avgWaitTime = Math.round(totalCurrentWaitTime / waitingRequestsCount);
    }
    
    const uptimeSeconds = process.uptime();
    let totalUptime = 0;
    
    if (uptimeSeconds >= 3600) {
      totalUptime = Math.round(uptimeSeconds / 3600);
    } else if (uptimeSeconds >= 60) {
      totalUptime = Math.round((uptimeSeconds / 3600) * 10) / 10; // Round to 1 decimal
    } else {
      totalUptime = 0;
    }

    res.json({
      requestsToday,
      avgWaitTime,
      totalUptime,
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
export async function getCounters(req: Request, res: Response): Promise<void> {
  try {
    const sessions = fetchSessions();
    
    // First, collect all counter sessions with their timestamps
    const counterSessions: Array<{
      sessionId: string;
      session: any;
      timestamp: number;
      isActive: boolean;
    }> = [];

    sessions.forEach((session, sessionId) => {
      if (!session.counter) return;
      
      console.log('Counter session found:', {
        sessionId,
        counter: session.counter,
        hasKey: !!session.counter.key,
        hasDateOpened: !!session.counter.dateOpened,
        dateOpened: session.counter.dateOpened
      });
      
      const timestamp = session.counter.dateOpened 
        ? new Date(session.counter.dateOpened).getTime()
        : Date.now();
      
      const isActive = !session.counter.dateClosed;
      
      counterSessions.push({
        sessionId,
        session,
        timestamp,
        isActive
      });
    });

    // Sort by active status first (active first), then by timestamp (oldest first)
    counterSessions.sort((a, b) => {
      if (a.isActive !== b.isActive) {
        return a.isActive ? -1 : 1; // Active sessions first
      }
      return a.timestamp - b.timestamp; // Then by timestamp (oldest first)
    });

    // Assign incremental counter names
    const sessionsList: Array<{
      id: number;
      counterName: string;
      sessionKey: string;
      startedAt: string;
      status: string;
      endedAt: string;
    }> = [];

    counterSessions.forEach((item, index) => {
      const counterNumber = index + 1;
      const counterName = `Counter ${counterNumber}`;
      const counterKey = item.session.counter.key || '-';
      
      // Format dates
      const startedAt = item.session.counter.dateOpened 
        ? new Date(item.session.counter.dateOpened).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })
        : '-';

      // Determine status
      let status = 'Active';
      let endedAt = '-';
      
      if (item.session.counter.dateClosed) {
        // Counter session has ended
        endedAt = new Date(item.session.counter.dateClosed).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        
        // Check if there are still applicants waiting
        let hasWaitingApplicants = false;
        const sessions = fetchSessions();
        sessions.forEach((session) => {
          if (session.applicant && 
              session.applicant.dateSubmitted && 
              !session.applicant.dateClosed) {
            hasWaitingApplicants = true;
          }
        });
        
        status = hasWaitingApplicants ? 'Ending' : 'Ended';
      }

      sessionsList.push({
        id: counterNumber,
        counterName,
        sessionKey: counterKey,
        startedAt,
        status,
        endedAt,
      });
    });

    // Add available keys as Online counters (generated but unused)
    const availableKeys = getAvailableKeys();
    let nextCounterNumber = counterSessions.length + 1;
    
    availableKeys.forEach((key) => {
      sessionsList.push({
        id: nextCounterNumber,
        counterName: `Counter ${nextCounterNumber}`,
        sessionKey: key,
        startedAt: '-',
        status: 'Online',
        endedAt: '-',
      });
      nextCounterNumber++;
    });

    res.json(sessionsList);
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve sessions list",
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
