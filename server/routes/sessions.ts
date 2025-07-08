import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();

// In-memory session storage (in production, use a database)
const sessions = new Map<string, any>();

// Health check for sessions API
router.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    sessions: sessions.size,
    timestamp: new Date().toISOString(),
  });
});

// Get session by ID
router.get("/:sessionId", (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const session = sessions.get(sessionId);

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json(session);
  } catch (error) {
    console.error("Error fetching session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create new session
router.post("/", (req: Request, res: Response) => {
  try {
    const sessionData = req.body;

    // Validate session data
    if (!sessionData.id || !sessionData.name) {
      return res.status(400).json({ error: "Invalid session data" });
    }

    // Store session
    sessions.set(sessionData.id, {
      ...sessionData,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
    });

    console.log(`Session created: ${sessionData.id}`);
    res.json({ success: true, sessionId: sessionData.id });
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update session
router.put("/:sessionId", (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const updateData = req.body;

    const existingSession = sessions.get(sessionId);
    if (!existingSession) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Update session
    const updatedSession = {
      ...existingSession,
      ...updateData,
      lastActivity: new Date().toISOString(),
    };

    sessions.set(sessionId, updatedSession);
    res.json(updatedSession);
  } catch (error) {
    console.error("Error updating session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete session
router.delete("/:sessionId", (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    if (!sessions.has(sessionId)) {
      return res.status(404).json({ error: "Session not found" });
    }

    sessions.delete(sessionId);
    console.log(`Session deleted: ${sessionId}`);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// List all active sessions (for debugging)
router.get("/", (req: Request, res: Response) => {
  try {
    const allSessions = Array.from(sessions.entries()).map(([id, session]) => ({
      id,
      name: session.name,
      participants: session.participants?.length || 0,
      isActive: session.isActive,
      createdAt: session.createdAt,
      lastActivity: session.lastActivity,
    }));

    res.json({ sessions: allSessions });
  } catch (error) {
    console.error("Error listing sessions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
