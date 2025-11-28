import { Request, Response } from "express";
import { fetchSessions } from "../db/sessions.js";
import { SessionData } from "express-session";

interface QueueApplicant {
  sessionId: string;
  name?: string;
  document?: string;
  isPriority: boolean;
  dateSubmitted: string;
  dateClosed?: string;
  dateProcessing?: string;
  assignedCounter?: string;
}

interface ActiveCounter {
  sessionId: string;
  counterName?: string;
  dateOpened: string;
  dateClosed?: string;
  assignedApplicants: string[];
}

export class QueueManager {
  private static getActiveCounters(sessions: Map<string, SessionData>): ActiveCounter[] {
    const activeCounters: ActiveCounter[] = [];

    sessions.forEach((session, sessionId) => {
      if (
        session.counter &&
        session.counter.dateOpened &&
        !session.counter.dateClosed
      ) {
        activeCounters.push({
          sessionId,
          counterName: session.deviceId, 
          dateOpened: session.counter.dateOpened,
          dateClosed: session.counter.dateClosed,
          assignedApplicants: [],
        });
      }
    });

    return activeCounters;
  }

  private static getWaitingApplicants(sessions: Map<string, SessionData>): QueueApplicant[] {
    const applicants: QueueApplicant[] = [];

    sessions.forEach((session, sessionId) => {
      if (
        session.applicant &&
        session.applicant.dateSubmitted
      ) {
        applicants.push({
          sessionId,
          name: session.applicant.name,
          document: session.applicant.document,
          isPriority: session.applicant.isPriority || false,
          dateSubmitted: session.applicant.dateSubmitted,
          dateClosed: session.applicant.dateClosed,
          dateProcessing: session.applicant.dateProcessing,
        });
      }
    });

    return applicants;
  }

  private static sortApplicants(applicants: QueueApplicant[]): QueueApplicant[] {
    return applicants.sort((a, b) => {
      if (a.isPriority && !b.isPriority) return -1;
      if (!a.isPriority && b.isPriority) return 1;

      const dateA = new Date(a.dateSubmitted).getTime();
      const dateB = new Date(b.dateSubmitted).getTime();
      return dateA - dateB;
    });
  }

  private static distributeApplicants(
    applicants: QueueApplicant[],
    counters: ActiveCounter[]
  ): Map<string, QueueApplicant[]> {
    const distribution = new Map<string, QueueApplicant[]>();

    counters.forEach((counter) => {
      distribution.set(counter.sessionId, []);
    });

    if (counters.length === 0) {
      return distribution;
    }

    let counterIndex = 0;
    applicants.forEach((applicant) => {
      const counter = counters[counterIndex];
      const counterQueue = distribution.get(counter.sessionId)!;
      
      counterQueue.push(applicant);
      applicant.assignedCounter = counter.sessionId;

      counterIndex = (counterIndex + 1) % counters.length;
    });

    return distribution;
  }

  public static manageQueue() {
    const sessions = fetchSessions();
    
    const activeCounters = this.getActiveCounters(sessions);
    const waitingApplicants = this.getWaitingApplicants(sessions);
    const sortedApplicants = this.sortApplicants(waitingApplicants);
    const distribution = this.distributeApplicants(sortedApplicants, activeCounters);
    
    const activeCountersObj: Record<string, {
      counterName?: string;
      dateOpened: string;
      queueLength: number;
    }> = {};
    
    activeCounters.forEach(c => {
      activeCountersObj[c.sessionId] = {
        counterName: c.counterName,
        dateOpened: c.dateOpened,
        queueLength: distribution.get(c.sessionId)?.length || 0,
      };
    });
    
    const applicantsMap: Record<string, string> = {};
    distribution.forEach((applicants, counterId) => {
      applicants.forEach(applicant => {
        applicantsMap[applicant.sessionId] = counterId;
      });
    });
    
    return {
      applicants: applicantsMap,
      activeCounters: activeCountersObj,
      queueDistribution: Array.from(distribution.entries()).map(([counterId, applicants]) => ({
        counterId,
        counterName: activeCounters.find(c => c.sessionId === counterId)?.counterName,
        applicants: applicants.map((a, index) => ({
          position: index + 1,
          sessionId: a.sessionId,
          name: a.name,
          document: a.document,
          isPriority: a.isPriority,
          dateSubmitted: a.dateSubmitted,
          dateClosed: a.dateClosed,
          dateProcessing: a.dateProcessing,
        })),
      })),
      statistics: {
        totalActiveCounters: activeCounters.length,
        totalWaitingApplicants: sortedApplicants.length,
        priorityApplicants: sortedApplicants.filter(a => a.isPriority).length,
        regularApplicants: sortedApplicants.filter(a => !a.isPriority).length,
      },
    };
  }

  public static getApplicantQueuePosition(applicantSessionId: string) {
    const queueData = this.manageQueue();
    
    for (const counter of queueData.queueDistribution) {
      const applicant = counter.applicants.find(a => a.sessionId === applicantSessionId);
      if (applicant) {
        return {
          found: true,
          counterId: counter.counterId,
          counterName: counter.counterName,
          position: applicant.position,
          totalInQueue: counter.applicants.length,
          isPriority: applicant.isPriority,
        };
      }
    }
    
    return {
      found: false,
      message: "Applicant not found in queue or already served",
    };
  }

  public static getNextApplicantForCounter(counterSessionId: string) {
    const queueData = this.manageQueue();
    const counterQueue = queueData.queueDistribution.find(
      (q) => q.counterId === counterSessionId
    );

    if (!counterQueue || counterQueue.applicants.length === 0) {
      return null;
    }

    return counterQueue.applicants[0];
  }
}

export async function getQueueStatus(req: Request, res: Response): Promise<void> {
  try {
    const queueData = QueueManager.manageQueue();
    res.json({
      success: true,
      data: {
        ...queueData,
        currentCounterId: req.sessionID, // Add the requesting counter's session ID
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to retrieve queue status",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}




// TBR
// export async function getApplicantPosition(req: Request, res: Response): Promise<void> {
//   try {
//     const applicantSessionId = req.params.sessionId || req.sessionID;
//     const position = QueueManager.getApplicantQueuePosition(applicantSessionId);
    
//     res.json({
//       success: true,
//       data: position,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: "Failed to retrieve applicant position",
//       message: error instanceof Error ? error.message : "Unknown error",
//     });
//   }
// }
// export async function getNextApplicant(req: Request, res: Response): Promise<void> {
//   try {
//     const counterSessionId = req.sessionID;
//     const nextApplicant = QueueManager.getNextApplicantForCounter(counterSessionId);
    
//     if (!nextApplicant) {
//       res.json({
//         success: true,
//         data: null,
//         message: "No applicants in queue",
//       });
//       return;
//     }
    
//     res.json({
//       success: true,
//       data: nextApplicant,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: "Failed to retrieve next applicant",
//       message: error instanceof Error ? error.message : "Unknown error",
//     });
//   }
// }
// export async function getCounterQueue(req: Request, res: Response): Promise<void> {
//   try {
//     const counterSessionId = req.params.counterId || req.sessionID;
//     const queueData = QueueManager.manageQueue();
    
//     const counterQueue = queueData.queueDistribution.find(
//       (q) => q.counterId === counterSessionId
//     );
    
//     if (!counterQueue) {
//       res.status(404).json({
//         success: false,
//         error: "Counter not found or not active",
//       });
//       return;
//     }
    
//     res.json({
//       success: true,
//       data: counterQueue,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: "Failed to retrieve counter queue",
//       message: error instanceof Error ? error.message : "Unknown error",
//     });
//   }
// }
// export async function getAllQueueItems(req: Request, res: Response): Promise<void> {
//   try {
//     const sessions = fetchSessions();
//     const queueItems: Array<{
//       id: number;
//       name: string;
//       request: string;
//       counter: string;
//       status: string;
//     }> = [];

//     let queueNumber = 1;

//     // Get all applicants (both waiting and served)
//     sessions.forEach((session, sessionId) => {
//       if (session.applicant && session.applicant.dateSubmitted) {
//         let status = 'Waiting';
//         let counter = '-';

//         if (session.applicant.dateServed) {
//           status = 'Ended';
//           // Try to find which counter served them (would need to be tracked)
//           counter = 'Completed';
//         } else {
//           // Check if currently being processed
//           const queueData = QueueManager.manageQueue();
//           for (const counterQueue of queueData.queueDistribution) {
//             const applicantInQueue = counterQueue.applicants.find(a => a.sessionId === sessionId);
//             if (applicantInQueue) {
//               counter = counterQueue.counterName || '-';
//               if (applicantInQueue.position === 1) {
//                 status = 'Processing';
//               }
//               break;
//             }
//           }
//         }

//         queueItems.push({
//           id: queueNumber,
//           name: session.applicant.name || 'Anonymous',
//           request: session.applicant.document || 'N/A',
//           counter: counter,
//           status: status,
//         });

//         queueNumber++;
//       }
//     });

//     res.json(queueItems);
//   } catch (error) {
//     res.status(500).json({
//       error: "Failed to retrieve queue items",
//       message: error instanceof Error ? error.message : "Unknown error",
//     });
//   }
// }
