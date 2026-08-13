import { Router, Response } from "express";
import prisma from "../middleware/prisma";
import { authenticate } from "../middleware/auth";
import { AuthRequest } from "../types";
import { parsePagination } from "../utils/helpers";

const router = Router();

// Get all notifications
router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  const { page, limit } = parsePagination(req.query as any);
  const { type, read } = req.query;

  const where: any = { userId: req.user!.id };
  if (type) where.type = type;
  if (read !== undefined) where.read = read === "true";

  const [notifications, total, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.notification.count({ where }),
    prisma.notification.count({ where: { userId: req.user!.id, read: false } }),
  ]);

  res.json({
    success: true,
    data: notifications,
    unreadCount,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

// Mark notification as read
router.put("/:id/read", authenticate, async (req: AuthRequest, res: Response) => {
  const notification = await prisma.notification.findFirst({
    where: { id: req.params.id, userId: req.user!.id },
  });

  if (!notification) {
    return res.status(404).json({ success: false, error: "Notification not found" });
  }

  const updated = await prisma.notification.update({
    where: { id: notification.id },
    data: { read: true },
  });

  res.json({ success: true, data: updated });
});

// Mark all as read
router.put("/read-all", authenticate, async (req: AuthRequest, res: Response) => {
  await prisma.notification.updateMany({
    where: { userId: req.user!.id, read: false },
    data: { read: true },
  });

  res.json({ success: true, message: "All notifications marked as read" });
});

// Delete notification
router.delete("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  const notification = await prisma.notification.findFirst({
    where: { id: req.params.id, userId: req.user!.id },
  });

  if (!notification) {
    return res.status(404).json({ success: false, error: "Notification not found" });
  }

  await prisma.notification.delete({ where: { id: notification.id } });
  res.json({ success: true, message: "Notification deleted" });
});

export default router;
