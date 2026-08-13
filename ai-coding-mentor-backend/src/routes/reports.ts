import { Router, Response } from "express";
import prisma from "../middleware/prisma";
import { authenticate } from "../middleware/auth";
import { AuthRequest } from "../types";

const router = Router();

router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  const totalAttempts = await prisma.challengeAttempt.count({ where: { userId } });
  const completed = await prisma.challengeAttempt.count({ where: { userId, completed: true } });
  const accuracy = totalAttempts > 0 ? Math.round((completed / totalAttempts) * 100) : 0;

  const profile = await prisma.userProfile.findUnique({ where: { userId } });
  const topicPerformance = await prisma.learningProgress.findMany({
    where: { userId },
    orderBy: { score: "desc" },
  });

  const strengths = topicPerformance.filter((t) => t.score >= 80);
  const weaknesses = topicPerformance.filter((t) => t.score < 70);

  const nextSteps: string[] = [];
  if (weaknesses.length > 0) {
    nextSteps.push(`Focus on ${weaknesses[0].topic} fundamentals`);
  }
  if (strengths.length > 0) {
    nextSteps.push(`Advance your ${strengths[0].topic} skills`);
  }
  nextSteps.push("Practice more algorithm problems");
  nextSteps.push("Build a full-stack project");

  const report = {
    overallScore: accuracy,
    stats: {
      problemsSolved: profile?.totalSolved || 0,
      learningHours: profile?.totalHours || 0,
      currentStreak: profile?.currentStreak || 0,
      topicsCovered: topicPerformance.length,
    },
    strengths: strengths.map((s) => ({ topic: s.topic, score: s.score })),
    weaknesses: weaknesses.map((w) => ({ topic: w.topic, score: w.score })),
    topicPerformance,
    nextSteps,
  };

  res.json({ success: true, data: report });
});

export default router;
