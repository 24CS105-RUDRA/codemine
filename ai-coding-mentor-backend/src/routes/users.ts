import { Router, Response } from "express";
import { z } from "zod";
import prisma from "../middleware/prisma";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { AuthRequest } from "../types";

const router = Router();

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  learningGoal: z.string().optional(),
  preferredLang: z.string().optional(),
  dailyGoal: z.number().min(5).max(480).optional(),
  theme: z.enum(["light", "dark", "system"]).optional(),
  aiResponseStyle: z.enum(["concise", "balanced", "detailed"]).optional(),
  aiExplanationLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  aiMentorPersonality: z.enum(["friendly", "professional", "direct", "encouraging"]).optional(),
});

// Get user profile with stats
router.get("/profile", authenticate, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: {
      profile: true,
      learningProgress: true,
      _count: {
        select: {
          challengeAttempts: true,
          documents: true,
          conversations: true,
        },
      },
    },
  });

  if (!user) {
    return res.status(404).json({ success: false, error: "User not found" });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({ success: true, data: userWithoutPassword });
});

// Update user settings
router.put("/settings", authenticate, validate(updateProfileSchema), async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: req.body,
    include: { profile: true },
  });

  const { password: _, ...userWithoutPassword } = user;
  res.json({ success: true, data: userWithoutPassword });
});

// Get learning progress
router.get("/progress", authenticate, async (req: AuthRequest, res: Response) => {
  const progress = await prisma.learningProgress.findMany({
    where: { userId: req.user!.id },
    orderBy: { score: "desc" },
  });

  res.json({ success: true, data: progress });
});

// Update learning progress for a topic
router.put("/progress/:topic", authenticate, async (req: AuthRequest, res: Response) => {
  const { topic } = req.params;
  const { score, level, problemsSolved } = req.body;

  const progress = await prisma.learningProgress.upsert({
    where: {
      userId_topic: { userId: req.user!.id, topic },
    },
    update: {
      ...(score !== undefined && { score }),
      ...(level !== undefined && { level }),
      ...(problemsSolved !== undefined && { problemsSolved }),
      lastPracticed: new Date(),
    },
    create: {
      userId: req.user!.id,
      topic,
      score: score || 0,
      level: level || "Beginner",
      problemsSolved: problemsSolved || 0,
      lastPracticed: new Date(),
    },
  });

  res.json({ success: true, data: progress });
});

// Get activity log
router.get("/activity", authenticate, async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const [activities, total] = await Promise.all([
    prisma.activityLog.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.activityLog.count({ where: { userId: req.user!.id } }),
  ]);

  res.json({
    success: true,
    data: activities,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// Get dashboard stats
router.get("/dashboard", authenticate, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  const [profile, challengeCount, correctAttempts, weeklyActivity, recentActivity] = await Promise.all([
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.challengeAttempt.count({ where: { userId } }),
    prisma.challengeAttempt.count({ where: { userId, completed: true } }),
    prisma.activityLog.groupBy({
      by: ["type"],
      where: {
        userId,
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      _count: true,
    }),
    prisma.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const accuracy = challengeCount > 0 ? Math.round((correctAttempts / challengeCount) * 100) : 0;

  res.json({
    success: true,
    data: {
      stats: {
        streak: profile?.currentStreak || 0,
        problemsSolved: profile?.totalSolved || 0,
        accuracy,
        learningHours: profile?.totalHours || 0,
      },
      weeklyActivity,
      recentActivity,
    },
  });
});

export default router;
