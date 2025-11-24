import { Request, Response } from "express";
import { fetchSessions } from "../db/sessions.js";
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
        dateActivated: counter.dateActivated,
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
        dateActivated: session.counter.dateActivated,
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

export async function openCounter(req: Request, res: Response): Promise<void> {
  try {
    if (!req.session.counter) {
      req.session.counter = {};
    }

    if (req.session.counter.dateOpened && !req.session.counter.dateClosed) {
      res.status(400).json({
        success: false,
        error: "Counter is already open",
        message: "Close the counter before opening it again",
      });
      return;
    }

    req.session.counter.dateOpened = new Date().toISOString();
    req.session.counter.dateClosed = undefined;

    if (!req.session.counter.key) {
      req.session.counter.key = addAvailableKey();
    }

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
        message: "Counter opened successfully",
        data: {
          sessionId: req.sessionID,
          deviceId: req.session.deviceId,
          key: req.session.counter?.key,
          dateOpened: req.session.counter?.dateOpened,
          dateActivated: req.session.counter?.dateActivated,
          status: "open",
        },
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to open counter",
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

    if (req.session.counter.dateActivated) {
      res.status(400).json({
        success: false,
        error: "Counter is already activated",
        message: "This counter has already been activated",
      });
      return;
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
    req.session.counter.dateActivated = new Date().toISOString();

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
        message: "Counter activated successfully",
        data: {
          sessionId: req.sessionID,
          deviceId: req.session.deviceId,
          key: req.session.counter?.key,
          dateActivated: req.session.counter?.dateActivated,
          status: "activated",
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

    const allowedFields = ["dateOpened", "dateClosed", "dateActivated"];

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
      dateActivated?: string;
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
          dateActivated: session.counter.dateActivated,
          status: isOpen ? "open" : "closed",
          isOpen,
        });
      }
    });

    counters.sort((a, b) => {
      const dateA = new Date(a.dateActivated || 0).getTime();
      const dateB = new Date(b.dateActivated || 0).getTime();
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
      dateOpened: string;
      dateActivated?: string;
    }> = [];

    sessions.forEach((session, sessionId) => {
      if (session.counter && session.counter.dateOpened && !session.counter.dateClosed) {
        activeCounters.push({
          sessionId,
          deviceId: session.deviceId,
          key: session.counter.key,
          dateOpened: session.counter.dateOpened,
          dateActivated: session.counter.dateActivated,
        });
      }
    });

    activeCounters.sort((a, b) => {
      const dateA = new Date(a.dateOpened).getTime();
      const dateB = new Date(b.dateOpened).getTime();
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
