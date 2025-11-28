import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FORMS_BASE_PATH = path.join(__dirname, '../../configs/forms');

interface FormResponse {
  [fieldId: string]: any;
}

/**
 * Start a form - Fetch form JSON from configs/forms directory
 * GET /api/form/start/:formReference
 */
export async function startForm(req: Request, res: Response): Promise<void> {
  try {
    const { formReference } = req.params;

    if (!formReference) {
      res.status(400).json({
        success: false,
        error: 'Form reference is required'
      });
      return;
    }

    // Construct form file path
    const formFilePath = path.join(FORMS_BASE_PATH, `${formReference}.json`);

    // Check if form exists
    try {
      await fs.access(formFilePath);
    } catch {
      res.status(404).json({
        success: false,
        error: 'Form not found',
        message: `Form "${formReference}" does not exist`
      });
      return;
    }

    // Read and parse form JSON
    const formData = await fs.readFile(formFilePath, 'utf-8');
    const formJson = JSON.parse(formData);

    // Store form reference in session for later submission
    req.session.currentForm = {
      formReference,
      startedAt: new Date().toISOString()
    };

    await new Promise<void>((resolve, reject) => {
      req.session.save((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({
      success: true,
      data: formJson,
      sessionId: req.sessionID
    });
  } catch (error) {
    console.error('Error starting form:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load form',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Submit a form - Save responses to session and create queue entry
 * POST /api/form/submit/:sessionId
 */
export async function submitForm(req: Request, res: Response): Promise<void> {
  try {
    const { sessionId } = req.params;
    const formResponses: FormResponse = req.body;

    // Validate that form was started
    if (!req.session.currentForm) {
      res.status(400).json({
        success: false,
        error: 'No active form',
        message: 'Please start a form before submitting'
      });
      return;
    }

    // Validate that responses were provided
    if (!formResponses || Object.keys(formResponses).length === 0) {
      res.status(400).json({
        success: false,
        error: 'Form responses are required'
      });
      return;
    }

    // Extract basic applicant information from responses
    const applicantName = formResponses.full_name || 
                          formResponses.applicant_name ||
                          formResponses.taxpayer_name ||
                          'Unknown';
    
    const documentType = req.session.currentForm.formReference;
    
    // Check if applicant is priority
    const isPriority = 
      formResponses.is_senior_citizen === true ||
      formResponses.is_pwd === true ||
      formResponses.is_pregnant === true ||
      formResponses.priority_lane === true ||
      false;

    // Save form responses and applicant data to session
    req.session.applicant = {
      name: applicantName,
      document: documentType,
      isPriority,
      dateSubmitted: new Date().toISOString(),
      dateClosed: undefined,
      feedbackChoice: undefined,
      feedbackComments: undefined,
      formResponses: formResponses // Store all form responses
    };

    // Clear current form reference since it's been submitted
    req.session.currentForm = undefined;

    // Save session
    await new Promise<void>((resolve, reject) => {
      req.session.save((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // At this point, the queue system will automatically pick up this applicant
    // via the QueueManager when queue endpoints are called

    res.json({
      success: true,
      message: 'Form submitted successfully',
      data: {
        sessionId: req.sessionID,
        applicant: {
          name: applicantName,
          document: documentType,
          isPriority,
          dateSubmitted: req.session.applicant.dateSubmitted
        }
      }
    });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit form',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Get form responses for current session
 * GET /api/form/responses
 */
export async function getFormResponses(req: Request, res: Response): Promise<void> {
  try {
    if (!req.session.applicant || !req.session.applicant.formResponses) {
      res.status(404).json({
        success: false,
        error: 'No form responses found',
        message: 'No form has been submitted in this session'
      });
      return;
    }

    res.json({
      success: true,
      data: {
        sessionId: req.sessionID,
        formResponses: req.session.applicant.formResponses,
        applicantInfo: {
          name: req.session.applicant.name,
          document: req.session.applicant.document,
          isPriority: req.session.applicant.isPriority,
          dateSubmitted: req.session.applicant.dateSubmitted
        }
      }
    });
  } catch (error) {
    console.error('Error retrieving form responses:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve form responses',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
