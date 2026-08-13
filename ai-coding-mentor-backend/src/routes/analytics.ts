import { Router, Response } from "express";
import prisma from "../middleware/prisma";
import { authenticate } from "../middleware/auth";
import { AuthRequest } from "../types";

const router = Router();

// Get analytics overview
router.get("/overview", authenticate, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  const [profile, challengeStats, topicPerformance, weeklyActivity, monthlyActivity] = await Promise.all([
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.challengeAttempt.aggregate({
      where: { userId },
      _count: true,
      _avg: { score: true },
      _sum: { runtime: true },
    }),
    prisma.learningProgress.findMany({
      where: { userId },
      orderBy: { score: "desc" },
    }),
    prisma.activityLog.groupBy({
      by: ["type"],
      where: {
        userId,
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      _count: true,
    }),
    prisma.activityLog.findMany({
      where: {
        userId,
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
      select: { createdAt: true, type: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  // Process monthly data
  const monthlyData: Record<string, { problems: number; hours: number }> = {};
  monthlyActivity.forEach((a) => {
    const month = new Date(a.createdAt).toLocaleString("default", { month: "short" });
    if (!monthlyData[month]) monthlyData[month] = { problems: 0, hours: 0 };
    if (a.type === "challenge") monthlyData[month].problems++;
    monthlyData[month].hours += 0.5;
  });

  const completedAttempts = await prisma.challengeAttempt.count({
    where: { userId, completed: true },
  });

  const totalAttempts = challengeStats._count || 0;
  const accuracy = totalAttempts > 0 ? Math.round((completedAttempts / totalAttempts) * 100) : 0;

  res.json({
    success: true,
    data: {
      overview: {
        accuracy,
        problemsSolved: profile?.totalSolved || 0,
        learningHours: profile?.totalHours || 0,
        currentStreak: profile?.currentStreak || 0,
      },
      topicPerformance,
      weeklyActivity,
      monthlyProgress: Object.entries(monthlyData).map(([month, data]) => ({
        month,
        ...data,
      })),
      difficultyDistribution: {
        easy: totalAttempts * 0.35,
        medium: totalAttempts * 0.4,
        hard: totalAttempts * 0.25,
      },
    },
  });
});

// Get weekly report
router.get("/weekly", authenticate, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [activities, attempts] = await Promise.all([
    prisma.activityLog.findMany({
      where: { userId, createdAt: { gte: weekAgo } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.challengeAttempt.findMany({
      where: { userId, createdAt: { gte: weekAgo } },
    }),
  ]);

  const totalSolved = attempts.filter((a) => a.completed).length;
  const accuracy = attempts.length > 0 ? Math.round((totalSolved / attempts.length) * 100) : 0;

  res.json({
    success: true,
    data: {
      totalProblems: attempts.length,
      solved: totalSolved,
      accuracy,
      activities: activities.length,
      topTopics: ["JavaScript", "React", "Algorithms"],
    },
  });
});

// Get topic breakdown
router.get("/topics", authenticate, async (req: AuthRequest, res: Response) => {
  const topics = await prisma.learningProgress.findMany({
    where: { userId: req.user!.id },
    orderBy: { score: "desc" },
  });

  const topicStats = topics.map((t) => ({
    topic: t.topic,
    score: t.score,
    level: t.level,
    problemsSolved: t.problemsSolved,
    trend: t.score >= 80 ? "up" : t.score >= 60 ? "stable" : "down",
  }));

  res.json({ success: true, data: topicStats });
});

export default router;
