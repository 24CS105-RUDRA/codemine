import { Router, Response } from "express";
import { z } from "zod";
import prisma from "../middleware/prisma";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { AuthRequest } from "../types";
import { parsePagination } from "../utils/helpers";
import { AIService } from "../services/ai";

const router = Router();
const aiService = new AIService();

const createConversationSchema = z.object({
  title: z.string().min(1).optional(),
});

const sendMessageSchema = z.object({
  content: z.string().min(1),
  code: z.string().optional(),
  language: z.string().optional(),
});

// Get all conversations
router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  const { page, limit } = parsePagination(req.query as any);

  const [conversations, total] = await Promise.all([
    prisma.conversation.findMany({
      where: { userId: req.user!.id },
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        _count: { select: { messages: true } },
      },
    }),
    prisma.conversation.count({ where: { userId: req.user!.id } }),
  ]);

  const conversationsWithLast = conversations.map((c) => ({
    ...c,
    lastMessage: c.messages[0]?.content || "",
    messageCount: c._count.messages,
    messages: undefined,
    _count: undefined,
  }));

  res.json({
    success: true,
    data: conversationsWithLast,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

// Get single conversation with messages
router.get("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  const conversation = await prisma.conversation.findFirst({
    where: { id: req.params.id, userId: req.user!.id },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!conversation) {
    return res.status(404).json({ success: false, error: "Conversation not found" });
  }

  res.json({ success: true, data: conversation });
});

// Create new conversation
router.post("/", authenticate, validate(createConversationSchema), async (req: AuthRequest, res: Response) => {
  const conversation = await prisma.conversation.create({
    data: {
      userId: req.user!.id,
      title: req.body.title || "New Conversation",
    },
  });

  res.status(201).json({ success: true, data: conversation });
});

// Send message and get AI response
router.post("/:id/messages", authenticate, validate(sendMessageSchema), async (req: AuthRequest, res: Response) => {
  const conversation = await prisma.conversation.findFirst({
    where: { id: req.params.id, userId: req.user!.id },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        take: 20,
      },
    },
  });

  if (!conversation) {
    return res.status(404).json({ success: false, error: "Conversation not found" });
  }

  // Save user message
  const userMessage = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      userId: req.user!.id,
      role: "user",
      content: req.body.content,
      code: req.body.code,
      language: req.body.language,
    },
  });

  // Build context for AI
  const context = conversation.messages.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  // Get AI response
  try {
    const aiResponse = await aiService.chat(context, req.body.content);

    // Save AI message
    const assistantMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "assistant",
        content: aiResponse.content,
        code: aiResponse.code,
        language: aiResponse.language,
      },
    });

    // Update conversation title if first message
    if (conversation.messages.length === 0) {
      const title = req.body.content.slice(0, 100);
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { title },
      });
    }

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: req.user!.id,
        type: "chat",
        title: "Asked AI mentor",
        description: req.body.content.slice(0, 200),
      },
    });

    res.json({
      success: true,
      data: { userMessage, assistantMessage },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: "Failed to get AI response",
      details: error.message,
    });
  }
});

// Delete conversation
router.delete("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  const conversation = await prisma.conversation.findFirst({
    where: { id: req.params.id, userId: req.user!.id },
  });

  if (!conversation) {
    return res.status(404).json({ success: false, error: "Conversation not found" });
  }

  await prisma.conversation.delete({ where: { id: conversation.id } });
  res.json({ success: true, message: "Conversation deleted" });
});

// Bookmark/save explanation
router.post("/:id/bookmark", authenticate, async (req: AuthRequest, res: Response) => {
  // Placeholder for bookmark functionality
  res.json({ success: true, message: "Bookmarked" });
});

export default router;
