import { Request, Response } from "express";
import { fetchSessions, storeSession } from "../db/sessions.js";
import { SessionData } from "express-session";
import { useKey, isKeyAvailable, addAvailableKey, getAvailableKeys, getUsedKeys, generateMultipleKeys } from "../utils/counterKeys.js";

export async function getCounterInfo(req: Request, res: Response): Promise<void> {
  try {
    const counter = req.session.counter;

    if (!counter) {
      res.status(404).json({
        success: false,
        error: "No counter information found in session",
        message: "This session does not have counter data. Please open a counter first.",
      });
      return;
    }

    const isOpen = counter.dateOpened && !counter.dateClosed;

    res.json({
      success: true,
      data: {
        sessionId: req.sessionID,
        deviceId: req.session.deviceId,
        key: counter.key,
        dateOpened: counter.dateOpened,
        dateClosed: counter.dateClosed,
        status: isOpen ? "open" : "closed",
        isOpen,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to retrieve counter information",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getCounterBySessionId(req: Request, res: Response): Promise<void> {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      res.status(400).json({
        success: false,
        error: "Session ID is required",
      });
      return;
    }

    const sessions = fetchSessions();
    const session = sessions.get(sessionId);

    if (!session || !session.counter) {
      res.status(404).json({
        success: false,
        error: "Counter not found",
        message: `No counter found with session ID: ${sessionId}`,
      });
      return;
    }

    const isOpen = session.counter.dateOpened && !session.counter.dateClosed;

    res.json({
      success: true,
      data: {
        sessionId,
        deviceId: session.deviceId,
        key: session.counter.key,
        dateOpened: session.counter.dateOpened,
        dateClosed: session.counter.dateClosed,
        status: isOpen ? "open" : "closed",
        isOpen,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to retrieve counter information",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}


export async function closeCounter(req: Request, res: Response): Promise<void> {
  try {
    if (!req.session.counter) {
      res.status(404).json({
        success: false,
        error: "No counter information found in session",
        message: "This session does not have counter data",
      });
      return;
    }

    if (!req.session.counter.dateOpened) {
      res.status(400).json({
        success: false,
        error: "Counter was never opened",
        message: "Cannot close a counter that was never opened",
      });
      return;
    }

    if (req.session.counter.dateClosed) {
      res.status(400).json({
        success: false,
        error: "Counter is already closed",
        message: "This counter has already been closed",
      });
      return;
    }

    // Check if there are any applicants assigned to this counter
    const sessions = fetchSessions();
    let hasActiveApplicants = false;

    sessions.forEach((session, sessionId) => {
      if (session.applicant && 
          session.applicant.dateSubmitted && 
          !session.applicant.dateServed &&
          session.counter?.key === req.session.counter?.key) {
        hasActiveApplicants = true;
      }
    });

    req.session.counter.dateClosed = new Date().toISOString();
    
    // Set status as "closing" if there are still active applicants, otherwise "closed"
    const status = hasActiveApplicants ? "closing" : "closed";

    req.session.save((err) => {
      if (err) {
        res.status(500).json({
          success: false,
          error: "Failed to save session",
          message: err.message,
        });
        return;
      }

      res.json({
        success: true,
        message: hasActiveApplicants 
          ? "Counter is closing - waiting for active applicants to be served"
          : "Counter closed successfully",
        data: {
          sessionId: req.sessionID,
          deviceId: req.session.deviceId,
          key: req.session.counter?.key,
          dateOpened: req.session.counter?.dateOpened,
          dateClosed: req.session.counter?.dateClosed,
          status,
          activeApplicants: hasActiveApplicants,
        },
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to close counter",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function activateCounter(req: Request, res: Response): Promise<void> {
  try {
    const { key } = req.body;

    if (!key) {
      res.status(400).json({
        success: false,
        error: "Counter key is required",
        message: "Please provide a valid counter key to activate",
      });
      return;
    }

    if (!isKeyAvailable(key)) {
      res.status(400).json({
        success: false,
        error: "Invalid or already used key",
        message: "The provided key is not available for activation",
      });
      return;
    }

    if (!req.session.counter) {
      req.session.counter = {};
    }

    // Check if this session already has an active counter (not closed)
    if (req.session.counter.dateOpened && !req.session.counter.dateClosed) {
      res.status(400).json({
        success: false,
        error: "Counter is already activated",
        message: "This counter has already been activated. Please logout first.",
      });
      return;
    }

    // If counter was previously closed, allow re-activation by resetting
    if (req.session.counter.dateClosed) {
      req.session.counter = {};
    }

    const keyUsed = useKey(key);
    if (!keyUsed) {
      res.status(400).json({
        success: false,
        error: "Failed to use key",
        message: "The key could not be marked as used",
      });
      return;
    }

    
    req.session.counter.key = key;
    const dateOpenedValue = new Date().toISOString();
    req.session.counter.dateOpened = dateOpenedValue;
    req.session.counter.dateClosed = undefined;

    req.session.save((err) => {
      if (err) {
        console.error('Failed to save session after activation:', err);
        res.status(500).json({
          success: false,
          error: "Failed to save session",
          message: err.message,
        });
        return;
      }

      res.json({
        success: true,
        message: "Counter activated successfully",
        data: {
          sessionId: req.sessionID,
          deviceId: req.session.deviceId,
          key: req.session.counter?.key,
          dateOpened: req.session.counter?.dateOpened,
          status: "open",
        },
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to activate counter",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function updateCounterInfo(req: Request, res: Response): Promise<void> {
  try {
    const updates = req.body;

    if (!req.session.counter) {
      req.session.counter = {};
    }

        const allowedFields = ["dateOpened", "dateClosed"];

    Object.keys(updates).forEach((key) => {
      if (allowedFields.includes(key)) {
        (req.session.counter as any)[key] = updates[key];
      }
    });

    req.session.save((err) => {
      if (err) {
        res.status(500).json({
          success: false,
          error: "Failed to save session",
          message: err.message,
        });
        return;
      }

      res.json({
        success: true,
        message: "Counter information updated successfully",
        data: req.session.counter,
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update counter information",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getAllCounters(req: Request, res: Response): Promise<void> {
  try {
    const sessions = fetchSessions();
    const counters: Array<{
      sessionId: string;
      deviceId?: string;
      key?: string;
      dateOpened?: string;
      dateClosed?: string;
      status: string;
      isOpen: boolean;
    }> = [];

    sessions.forEach((session, sessionId) => {
      if (session.counter) {
        const isOpen = !!session.counter.dateOpened && !session.counter.dateClosed;
        counters.push({
          sessionId,
          deviceId: session.deviceId,
          key: session.counter.key,
          dateOpened: session.counter.dateOpened,
          dateClosed: session.counter.dateClosed,
          status: isOpen ? "open" : "closed",
          isOpen,
        });
      }
    });

    counters.sort((a, b) => {
      const dateA = new Date(a.dateOpened || 0).getTime();
      const dateB = new Date(b.dateOpened || 0).getTime();
      return dateB - dateA;
    });

    res.json({
      success: true,
      data: {
        total: counters.length,
        open: counters.filter((c) => c.isOpen).length,
        closed: counters.filter((c) => !c.isOpen).length,
        counters,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to retrieve counters",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getActiveCounters(req: Request, res: Response): Promise<void> {
  try {
    const sessions = fetchSessions();
    const activeCounters: Array<{
      sessionId: string;
      deviceId?: string;
      key?: string;
      dateOpened?: string;
      status: string;
    }> = [];

    sessions.forEach((session, sessionId) => {
      if (session.counter && session.counter.dateOpened && !session.counter.dateClosed) {
        activeCounters.push({
          sessionId,
          deviceId: session.deviceId,
          key: session.counter.key,
          dateOpened: session.counter.dateOpened,
          status: "open",
        });
      }
    });

    activeCounters.sort((a, b) => {
      const dateA = new Date(a.dateOpened || 0).getTime();
      const dateB = new Date(b.dateOpened || 0).getTime();
      return dateA - dateB;
    });

    res.json({
      success: true,
      data: {
        total: activeCounters.length,
        counters: activeCounters,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to retrieve active counters",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function deleteCounterInfo(req: Request, res: Response): Promise<void> {
  try {
    if (!req.session.counter) {
      res.status(404).json({
        success: false,
        error: "No counter information found",
      });
      return;
    }

    const deletedData = { ...req.session.counter };
    delete req.session.counter;

    req.session.save((err) => {
      if (err) {
        res.status(500).json({
          success: false,
          error: "Failed to delete counter information",
          message: err.message,
        });
        return;
      }

      res.json({
        success: true,
        message: "Counter information deleted successfully",
        deletedData,
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to delete counter information",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getAvailableKeysHandler(req: Request, res: Response): Promise<void> {
  try {
    const availableKeys = getAvailableKeys();
    const usedKeys = getUsedKeys();

    res.json({
      success: true,
      data: {
        available: availableKeys,
        used: usedKeys,
        totalAvailable: availableKeys.length,
        totalUsed: usedKeys.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to retrieve keys",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function generateKeysHandler(req: Request, res: Response): Promise<void> {
  try {
    const key = addAvailableKey();

    res.json({
      success: true,
      message: "Generated counter key",
      data: {
        key,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to generate key",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function serveApplicant(req: Request, res: Response): Promise<void> {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      res.status(400).json({
        success: false,
        error: "Session ID is required",
      });
      return;
    }

    const sessions = fetchSessions();
    const applicantSession = sessions.get(sessionId);

    if (!applicantSession || !applicantSession.applicant) {
      res.status(404).json({
        success: false,
        error: "Applicant not found",
      });
      return;
    }

    // Update the session data
    applicantSession.applicant.dateServed = new Date().toISOString();
    applicantSession.applicant.closedServed = "completed";

    // Save to database
    storeSession(sessionId, applicantSession);

    res.json({
      success: true,
      message: "Applicant marked as served",
      data: {
        sessionId,
        name: applicantSession.applicant.name,
        dateServed: applicantSession.applicant.dateServed,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to serve applicant",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function markApplicantMissing(req: Request, res: Response): Promise<void> {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      res.status(400).json({
        success: false,
        error: "Session ID is required",
      });
      return;
    }

    const sessions = fetchSessions();
    const applicantSession = sessions.get(sessionId);

    if (!applicantSession || !applicantSession.applicant) {
      res.status(404).json({
        success: false,
        error: "Applicant not found",
      });
      return;
    }

    // Update the session data
    applicantSession.applicant.closedServed = "missing";
    applicantSession.applicant.dateServed = new Date().toISOString();

    // Save to database
    storeSession(sessionId, applicantSession);

    res.json({
      success: true,
      message: "Applicant marked as missing",
      data: {
        sessionId,
        name: applicantSession.applicant.name,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to mark applicant as missing",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function closeApplicantRequest(req: Request, res: Response): Promise<void> {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      res.status(400).json({
        success: false,
        error: "Session ID is required",
      });
      return;
    }

    const sessions = fetchSessions();
    const applicantSession = sessions.get(sessionId);

    if (!applicantSession || !applicantSession.applicant) {
      res.status(404).json({
        success: false,
        error: "Applicant not found",
      });
      return;
    }

    // Update the session data
    applicantSession.applicant.closedServed = "closed";
    applicantSession.applicant.dateServed = new Date().toISOString();

    // Save to database
    storeSession(sessionId, applicantSession);

    res.json({
      success: true,
      message: "Applicant request closed",
      data: {
        sessionId,
        name: applicantSession.applicant.name,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to close applicant request",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function logoutCounter(req: Request, res: Response): Promise<void> {
  try {
    if (!req.session.counter) {
      res.status(404).json({
        success: false,
        error: "No counter session found",
      });
      return;
    }

    // Close the counter if it's still open
    if (req.session.counter.dateOpened && !req.session.counter.dateClosed) {
      req.session.counter.dateClosed = new Date().toISOString();
    }

    // Clear the counter data to allow re-login
    delete req.session.counter;

    req.session.save((err) => {
      if (err) {
        res.status(500).json({
          success: false,
          error: "Failed to logout",
          message: err.message,
        });
        return;
      }

      res.json({
        success: true,
        message: "Logged out successfully. Counter session ended.",
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to logout",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
