import { Request, Response } from "express";
import { fetchSessions } from "../db/sessions.js";
import { SessionData } from "express-session";

export async function getApplicantInfo(req: Request, res: Response): Promise<void> {
  try {
    const applicant = req.session.applicant;

    if (!applicant) {
      res.status(404).json({
        success: false,
        error: "No applicant information found in session",
        message: "This session does not have applicant data. Please submit a form first.",
      });
      return;
    }

    res.json({
      success: true,
      data: {
        sessionId: req.sessionID,
        name: applicant.name,
        document: applicant.document,
        isPriority: applicant.isPriority || false,
        dateSubmitted: applicant.dateSubmitted,
        dateServed: applicant.dateServed,
        closedServed: applicant.closedServed,
        feedbackChoice: applicant.feedbackChoice,
        feedbackComments: applicant.feedbackComments,
        status: applicant.dateServed ? "served" : "waiting",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to retrieve applicant information",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getApplicantBySessionId(req: Request, res: Response): Promise<void> {
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

    if (!session || !session.applicant) {
      res.status(404).json({
        success: false,
        error: "Applicant not found",
        message: `No applicant found with session ID: ${sessionId}`,
      });
      return;
    }

    res.json({
      success: true,
      data: {
        sessionId,
        name: session.applicant.name,
        document: session.applicant.document,
        isPriority: session.applicant.isPriority || false,
        dateSubmitted: session.applicant.dateSubmitted,
        dateServed: session.applicant.dateServed,
        closedServed: session.applicant.closedServed,
        feedbackChoice: session.applicant.feedbackChoice,
        feedbackComments: session.applicant.feedbackComments,
        status: session.applicant.dateServed ? "served" : "waiting",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to retrieve applicant information",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function updateApplicantInfo(req: Request, res: Response): Promise<void> {
  try {
    const updates = req.body;

    if (!req.session.applicant) {
      req.session.applicant = {};
    }

    // Only update allowed fields
    const allowedFields = [
      "name",
      "document",
      "isPriority",
      "dateSubmitted",
      "dateServed",
      "closedServed",
      "feedbackChoice",
      "feedbackComments",
    ];

    Object.keys(updates).forEach((key) => {
      if (allowedFields.includes(key)) {
        (req.session.applicant as any)[key] = updates[key];
      }
    });

    // Save session
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
        message: "Applicant information updated successfully",
        data: req.session.applicant,
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update applicant information",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function submitApplicantForm(req: Request, res: Response): Promise<void> {
  try {
    const { name, document, isPriority } = req.body;

    if (!name || !document) {
      res.status(400).json({
        success: false,
        error: "Name and document are required",
      });
      return;
    }

    // Initialize or update applicant data
    req.session.applicant = {
      name,
      document,
      isPriority: isPriority || false,
      dateSubmitted: new Date().toISOString(),
      dateServed: undefined,
      closedServed: undefined,
      feedbackChoice: undefined,
      feedbackComments: undefined,
    };

    // Save session
    req.session.save((err) => {
      if (err) {
        res.status(500).json({
          success: false,
          error: "Failed to save form submission",
          message: err.message,
        });
        return;
      }

      res.json({
        success: true,
        message: "Form submitted successfully",
        data: {
          sessionId: req.sessionID,
          ...req.session.applicant,
        },
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to submit form",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function markApplicantServed(req: Request, res: Response): Promise<void> {
  try {
    const { sessionId } = req.params;
    const { closedServed } = req.body;

    // If sessionId provided, mark that applicant; otherwise mark current session
    if (sessionId && sessionId !== req.sessionID) {
      // Admin/Counter marking another applicant as served
      // Note: This requires direct session manipulation which isn't ideal
      // Better approach would be to use a database or proper session store API
      res.status(501).json({
        success: false,
        error: "Marking other sessions as served requires database implementation",
        message: "Please use the applicant's own session to mark as served",
      });
      return;
    }

    if (!req.session.applicant) {
      res.status(404).json({
        success: false,
        error: "No applicant information found",
      });
      return;
    }

    req.session.applicant.dateServed = new Date().toISOString();
    if (closedServed) {
      req.session.applicant.closedServed = closedServed;
    }

    req.session.save((err) => {
      if (err) {
        res.status(500).json({
          success: false,
          error: "Failed to mark as served",
          message: err.message,
        });
        return;
      }

      res.json({
        success: true,
        message: "Applicant marked as served",
        data: req.session.applicant,
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to mark applicant as served",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function submitFeedback(req: Request, res: Response): Promise<void> {
  try {
    const { feedbackChoice, feedbackComments } = req.body;

    if (!req.session.applicant) {
      res.status(404).json({
        success: false,
        error: "No applicant information found",
      });
      return;
    }

    if (!feedbackChoice) {
      res.status(400).json({
        success: false,
        error: "Feedback choice is required",
      });
      return;
    }

    req.session.applicant.feedbackChoice = feedbackChoice;
    req.session.applicant.feedbackComments = feedbackComments || "";

    req.session.save((err) => {
      if (err) {
        res.status(500).json({
          success: false,
          error: "Failed to save feedback",
          message: err.message,
        });
        return;
      }

      res.json({
        success: true,
        message: "Feedback submitted successfully",
        data: {
          feedbackChoice: req.session.applicant?.feedbackChoice,
          feedbackComments: req.session.applicant?.feedbackComments,
        },
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to submit feedback",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getAllApplicants(req: Request, res: Response): Promise<void> {
  try {
    const sessions = fetchSessions();
    const applicants: Array<{
      sessionId: string;
      name?: string;
      document?: string;
      isPriority: boolean;
      dateSubmitted?: string;
      dateServed?: string;
      status: string;
    }> = [];

    sessions.forEach((session, sessionId) => {
      if (session.applicant && session.applicant.dateSubmitted) {
        applicants.push({
          sessionId,
          name: session.applicant.name,
          document: session.applicant.document,
          isPriority: session.applicant.isPriority || false,
          dateSubmitted: session.applicant.dateSubmitted,
          dateServed: session.applicant.dateServed,
          status: session.applicant.dateServed ? "served" : "waiting",
        });
      }
    });

    applicants.sort((a, b) => {
      const dateA = new Date(a.dateSubmitted || 0).getTime();
      const dateB = new Date(b.dateSubmitted || 0).getTime();
      return dateB - dateA;
    });

    res.json({
      success: true,
      data: {
        total: applicants.length,
        waiting: applicants.filter((a) => a.status === "waiting").length,
        served: applicants.filter((a) => a.status === "served").length,
        applicants,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to retrieve applicants",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function deleteApplicantInfo(req: Request, res: Response): Promise<void> {
  try {
    if (!req.session.applicant) {
      res.status(404).json({
        success: false,
        error: "No applicant information found",
      });
      return;
    }

    const deletedData = { ...req.session.applicant };
    delete req.session.applicant;

    req.session.save((err) => {
      if (err) {
        res.status(500).json({
          success: false,
          error: "Failed to delete applicant information",
          message: err.message,
        });
        return;
      }

      res.json({
        success: true,
        message: "Applicant information deleted successfully",
        deletedData,
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to delete applicant information",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
