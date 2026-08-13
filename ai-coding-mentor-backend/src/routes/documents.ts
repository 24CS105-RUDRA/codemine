import { Router, Response } from "express";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import prisma from "../middleware/prisma";
import { authenticate } from "../middleware/auth";
import { AuthRequest } from "../types";
import { parsePagination } from "../utils/helpers";
import { config } from "../config";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, config.upload.dir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: config.upload.maxFileSize },
  fileFilter: (_req, file, cb) => {
    const allowed = [".pdf", ".csv", ".txt", ".md", ".png", ".jpg", ".jpeg", ".json", ".ts", ".tsx", ".js", ".jsx"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${ext} not allowed`));
    }
  },
});

const router = Router();

function parseDocument(d: any) {
  return {
    ...d,
    topics: typeof d.topics === "string" ? JSON.parse(d.topics) : d.topics,
    metadata: typeof d.metadata === "string" ? JSON.parse(d.metadata) : d.metadata,
  };
}

// Get all documents
router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  const { page, limit } = parsePagination(req.query as any);
  const { type, status } = req.query;

  const where: any = { userId: req.user!.id };
  if (type) where.type = type;
  if (status) where.status = status;

  const [documents, total] = await Promise.all([
    prisma.document.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.document.count({ where }),
  ]);

  res.json({
    success: true,
    data: documents.map(parseDocument),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

// Upload document
router.post("/upload", authenticate, upload.single("file"), async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: "No file uploaded" });
  }

  const ext = path.extname(req.file.originalname).toLowerCase();
  let type = "text";
  if (ext === ".pdf") type = "pdf";
  else if (ext === ".csv") type = "csv";
  else if ([".png", ".jpg", ".jpeg"].includes(ext)) type = "image";

  const document = await prisma.document.create({
    data: {
      userId: req.user!.id,
      name: req.file.originalname,
      originalName: req.file.originalname,
      type,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      status: "processing",
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: req.user!.id,
      type: "document",
      title: `Uploaded ${req.file.originalname}`,
      description: `${(req.file.size / 1024).toFixed(1)} KB`,
    },
  });

  setTimeout(async () => {
    await prisma.document.update({
      where: { id: document.id },
      data: {
        status: "processed",
        summary: `Document "${req.file!.originalname}" has been processed and is ready for analysis.`,
        topics: JSON.stringify(["General"]),
      },
    });
  }, 2000);

  res.status(201).json({ success: true, data: parseDocument(document) });
});

// Get single document
router.get("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  const document = await prisma.document.findFirst({
    where: { id: req.params.id, userId: req.user!.id },
  });

  if (!document) {
    return res.status(404).json({ success: false, error: "Document not found" });
  }

  res.json({ success: true, data: parseDocument(document) });
});

// Delete document
router.delete("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  const document = await prisma.document.findFirst({
    where: { id: req.params.id, userId: req.user!.id },
  });

  if (!document) {
    return res.status(404).json({ success: false, error: "Document not found" });
  }

  const fs = require("fs");
  try { fs.unlinkSync(document.path); } catch {}

  await prisma.document.delete({ where: { id: document.id } });
  res.json({ success: true, message: "Document deleted" });
});

// Analyze document
router.post("/:id/analyze", authenticate, async (req: AuthRequest, res: Response) => {
  const document = await prisma.document.findFirst({
    where: { id: req.params.id, userId: req.user!.id },
  });

  if (!document) {
    return res.status(404).json({ success: false, error: "Document not found" });
  }

  const topics = typeof document.topics === "string" ? JSON.parse(document.topics) : document.topics || [];

  const analysis = {
    summary: `This document covers ${topics.join(", ") || "various topics"}.`,
    keyPoints: [
      "Main concept explanation with practical examples",
      "Common patterns and best practices",
      "Potential pitfalls and how to avoid them",
    ],
    suggestedTopics: ["Related concept 1", "Related concept 2"],
    quizQuestions: [
      { question: "What is the main topic?", options: ["A", "B", "C", "D"] },
    ],
  };

  res.json({ success: true, data: analysis });
});

export default router;
