import { Request, Response } from "express";
import { fetchSessions, deleteSession } from "../db/sessions.js";
import { getAvailableKeys } from "../utils/counterKeys.js";

export async function getSessions(req: Request, res: Response): Promise<void> {
    const obj = Object.fromEntries(fetchSessions());
    res.json(obj);
}

export async function getCurrentSession(req: Request, res: Response): Promise<void> {
  res.json(fetchSessions().get(req.sessionID));
}


// TBR
export async function removeSession(req: Request, res: Response): Promise<void> {
  try {
    const { sessionId } = req.params;
    
    if (!sessionId) {
      res.status(400).json({ error: "Session ID is required" });
      return;
    }

    // Check if session exists
    const sessions = fetchSessions();
    if (!sessions.has(sessionId)) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    // Delete the session (moves to backup)
    deleteSession(sessionId);
    
    res.json({ message: "Session deleted successfully", sessionId });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete session",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getSessionsList(req: Request, res: Response): Promise<void> {
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
              !session.applicant.dateServed) {
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
