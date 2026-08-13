import { Router, Response } from "express";
import prisma from "../middleware/prisma";
import { authenticate } from "../middleware/auth";
import { AuthRequest } from "../types";

const router = Router();

router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  const { type } = req.query;
  const where: any = { userId: req.user!.id };
  if (type) where.type = type;

  const recommendations = await prisma.recommendation.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  res.json({ success: true, data: recommendations });
});

router.post("/generate", authenticate, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  const progress = await prisma.learningProgress.findMany({
    where: { userId },
    orderBy: { score: "desc" },
  });

  const recs: any[] = [];

  const weakTopics = progress.filter((p) => p.score < 70);
  for (const t of weakTopics.slice(0, 2)) {
    recs.push({
      userId,
      title: `Improve ${t.topic} Skills`,
      reason: `Your ${t.topic} score is ${Math.round(t.score)}%. Let's improve it!`,
      difficulty: t.level,
      estimatedTime: 60,
      topic: t.topic,
      type: "topic",
    });
  }

  const strongTopics = progress.filter((p) => p.score >= 80);
  for (const t of strongTopics.slice(0, 2)) {
    recs.push({
      userId,
      title: `Master Advanced ${t.topic}`,
      reason: "Great foundation! Time to level up.",
      difficulty: "Advanced",
      estimatedTime: 90,
      topic: t.topic,
      type: "topic",
    });
  }

  const projectTopics = ["Node.js", "React", "TypeScript"];
  for (const topic of projectTopics.slice(0, 2)) {
    recs.push({
      userId,
      title: `Build a ${topic} Project`,
      reason: "Apply your knowledge with a hands-on project.",
      difficulty: "Intermediate",
      estimatedTime: 120,
      topic,
      type: "project",
    });
  }

  const created = await prisma.recommendation.createMany({ data: recs });
  const all = await prisma.recommendation.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  res.json({ success: true, data: all });
});

export default router;
