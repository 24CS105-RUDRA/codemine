import { Router, Response } from "express";
import prisma from "../middleware/prisma";
import { authenticate } from "../middleware/auth";
import { AuthRequest } from "../types";

const router = Router();

router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  const profile = await prisma.userProfile.findUnique({ where: { userId } });
  const recentActivity = await prisma.activityLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const topics = await prisma.learningProgress.findMany({
    where: { userId },
    orderBy: { score: "desc" },
  });

  res.json({
    success: true,
    data: {
      streak: profile?.currentStreak || 0,
      problemsSolved: profile?.totalSolved || 0,
      accuracy: profile?.accuracy || 0,
      learningHours: profile?.totalHours || 0,
      recentActivity,
      topics,
    },
  });
});

export default router;
