import { Router, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import prisma from "../middleware/prisma";
import { authenticate, generateTokens, verifyRefreshToken } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { AuthRequest } from "../types";

const router = Router();

const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

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

// Register
router.post("/register", validate(registerSchema), async (req: AuthRequest, res: Response) => {
  const { email, name, password } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ success: false, error: "Email already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      profile: {
        create: {},
      },
    },
    include: { profile: true },
  });

  const { accessToken, refreshToken } = generateTokens({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  const { password: _, ...userWithoutPassword } = user;

  res.status(201).json({
    success: true,
    data: {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    },
  });
});

// Login
router.post("/login", validate(loginSchema), async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
    include: { profile: true },
  });

  if (!user) {
    return res.status(401).json({ success: false, error: "Invalid credentials" });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ success: false, error: "Invalid credentials" });
  }

  const { accessToken, refreshToken } = generateTokens({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  const { password: _, ...userWithoutPassword } = user;

  res.json({
    success: true,
    data: {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    },
  });
});

// Refresh Token
router.post("/refresh", async (req: AuthRequest, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ success: false, error: "Refresh token required" });
  }

  const decoded = await verifyRefreshToken(refreshToken);
  if (!decoded) {
    return res.status(401).json({ success: false, error: "Invalid refresh token" });
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
  if (!user) {
    return res.status(401).json({ success: false, error: "User not found" });
  }

  // Delete old refresh token
  await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });

  const tokens = generateTokens({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  await prisma.refreshToken.create({
    data: {
      token: tokens.refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  res.json({ success: true, data: tokens });
});

// Logout
router.post("/logout", authenticate, async (req: AuthRequest, res: Response) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  }
  res.json({ success: true, message: "Logged out" });
});

// Get current user
router.get("/me", authenticate, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: { profile: true },
  });

  if (!user) {
    return res.status(404).json({ success: false, error: "User not found" });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({ success: true, data: userWithoutPassword });
});

// Update profile
router.put("/profile", authenticate, validate(updateProfileSchema), async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: req.body,
    include: { profile: true },
  });

  const { password: _, ...userWithoutPassword } = user;
  res.json({ success: true, data: userWithoutPassword });
});

export default router;
