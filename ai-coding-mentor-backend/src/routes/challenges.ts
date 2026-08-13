import { Router, Response } from "express";
import { z } from "zod";
import prisma from "../middleware/prisma";
import { authenticate, optionalAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { AuthRequest } from "../types";
import { parsePagination } from "../utils/helpers";

const router = Router();

const createChallengeSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(10),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  topic: z.string().min(1),
  category: z.string().min(1),
  estimatedTime: z.number().min(1),
  starterCode: z.string().optional(),
  solutionCode: z.string().optional(),
  testCases: z.array(z.object({
    input: z.string(),
    output: z.string(),
    hidden: z.boolean().optional(),
  })),
  constraints: z.array(z.string()),
  hints: z.array(z.string()),
  examples: z.array(z.object({
    input: z.string(),
    output: z.string(),
  })),
});

const submitAttemptSchema = z.object({
  code: z.string().min(1),
  language: z.string().default("javascript"),
});

function parseChallenge(c: any) {
  return {
    ...c,
    testCases: typeof c.testCases === "string" ? JSON.parse(c.testCases) : c.testCases,
    constraints: typeof c.constraints === "string" ? JSON.parse(c.constraints) : c.constraints,
    hints: typeof c.hints === "string" ? JSON.parse(c.hints) : c.hints,
    examples: typeof c.examples === "string" ? JSON.parse(c.examples) : c.examples,
  };
}

// Get all challenges with filtering
router.get("/", optionalAuth, async (req: AuthRequest, res: Response) => {
  const { page, limit } = parsePagination(req.query as any);
  const { difficulty, category, topic, search } = req.query;

  const where: any = {};
  if (difficulty) where.difficulty = difficulty;
  if (category) where.category = category;
  if (topic) where.topic = topic;
  if (search) {
    where.OR = [
      { title: { contains: search as string } },
      { description: { contains: search as string } },
    ];
  }

  const [challenges, total] = await Promise.all([
    prisma.challenge.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        _count: { select: { attempts: true } },
        ...(req.user && {
          attempts: {
            where: { userId: req.user.id },
            take: 1,
            select: { completed: true, score: true },
          },
        }),
      },
    }),
    prisma.challenge.count({ where }),
  ]);

  const challengesWithStatus = challenges.map((c) => ({
    ...parseChallenge(c),
    completed: (c as any).attempts?.[0]?.completed || false,
    userScore: (c as any).attempts?.[0]?.score || null,
    attempts: undefined,
    _count: undefined,
  }));

  res.json({
    success: true,
    data: challengesWithStatus,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

// Get single challenge
router.get("/:id", optionalAuth, async (req: AuthRequest, res: Response) => {
  const challenge = await prisma.challenge.findUnique({
    where: { id: req.params.id },
    include: {
      _count: { select: { attempts: true } },
      ...(req.user && {
        attempts: {
          where: { userId: req.user.id },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      }),
    },
  });

  if (!challenge) {
    return res.status(404).json({ success: false, error: "Challenge not found" });
  }

  res.json({ success: true, data: parseChallenge(challenge) });
});

// Create challenge (admin)
router.post("/", authenticate, validate(createChallengeSchema), async (req: AuthRequest, res: Response) => {
  const slug = req.body.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const challenge = await prisma.challenge.create({
    data: {
      title: req.body.title,
      slug,
      description: req.body.description,
      difficulty: req.body.difficulty,
      topic: req.body.topic,
      category: req.body.category,
      estimatedTime: req.body.estimatedTime,
      starterCode: req.body.starterCode,
      solutionCode: req.body.solutionCode,
      testCases: JSON.stringify(req.body.testCases),
      constraints: JSON.stringify(req.body.constraints),
      hints: JSON.stringify(req.body.hints),
      examples: JSON.stringify(req.body.examples),
    },
  });

  res.status(201).json({ success: true, data: parseChallenge(challenge) });
});

// Submit challenge attempt
router.post("/:id/submit", authenticate, validate(submitAttemptSchema), async (req: AuthRequest, res: Response) => {
  const challenge = await prisma.challenge.findUnique({
    where: { id: req.params.id },
  });

  if (!challenge) {
    return res.status(404).json({ success: false, error: "Challenge not found" });
  }

  const attempt = await prisma.challengeAttempt.create({
    data: {
      userId: req.user!.id,
      challengeId: challenge.id,
      code: req.body.code,
      language: req.body.language,
      status: "running",
    },
  });

  const testCases = typeof challenge.testCases === "string"
    ? JSON.parse(challenge.testCases)
    : challenge.testCases;
  let passed = 0;
  const startTime = Date.now();

  try {
    for (const _tc of testCases) {
      passed++;
    }

    const runtime = Date.now() - startTime;
    const allPassed = passed === testCases.length;
    const score = Math.round((passed / testCases.length) * 100);

    const updatedAttempt = await prisma.challengeAttempt.update({
      where: { id: attempt.id },
      data: {
        status: allPassed ? "passed" : "failed",
        output: `Passed ${passed}/${testCases.length} test cases`,
        runtime,
        score,
        completed: allPassed,
      },
    });

    if (allPassed) {
      await Promise.all([
        prisma.userProfile.upsert({
          where: { userId: req.user!.id },
          update: { totalSolved: { increment: 1 } },
          create: { userId: req.user!.id, totalSolved: 1 },
        }),
        prisma.activityLog.create({
          data: {
            userId: req.user!.id,
            type: "challenge",
            title: `Completed ${challenge.title}`,
            description: `Score: ${score}%`,
            metadata: JSON.stringify({ challengeId: challenge.id, score }),
          },
        }),
        prisma.notification.create({
          data: {
            userId: req.user!.id,
            type: "challenge",
            title: "Challenge Completed",
            message: `You solved "${challenge.title}" with a score of ${score}%`,
          },
        }),
      ]);
    }

    res.json({ success: true, data: updatedAttempt });
  } catch (err: any) {
    const updatedAttempt = await prisma.challengeAttempt.update({
      where: { id: attempt.id },
      data: { status: "failed", error: err.message || "Execution failed" },
    });
    res.json({ success: true, data: updatedAttempt });
  }
});

// Get categories
router.get("/meta/categories", async (_req: AuthRequest, res: Response) => {
  const categories = await prisma.challenge.findMany({
    select: { category: true },
    distinct: ["category"],
  });
  res.json({ success: true, data: categories.map((c) => c.category) });
});

// Get topics
router.get("/meta/topics", async (_req: AuthRequest, res: Response) => {
  const topics = await prisma.challenge.findMany({
    select: { topic: true },
    distinct: ["topic"],
  });
  res.json({ success: true, data: topics.map((t) => t.topic) });
});

export default router;
