import { Router, Response } from "express";
import prisma from "../middleware/prisma";
import { authenticate } from "../middleware/auth";
import { AuthRequest } from "../types";

const router = Router();

router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  const modules = await prisma.learningModule.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      lessons: { orderBy: { sortOrder: "asc" } },
    },
  });

  res.json({ success: true, data: modules });
});

router.get("/progress", authenticate, async (req: AuthRequest, res: Response) => {
  const progress = await prisma.learningProgress.findMany({
    where: { userId: req.user!.id },
  });
  res.json({ success: true, data: progress });
});

export default router;
