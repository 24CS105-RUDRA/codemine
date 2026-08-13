import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "path";
import { createServer } from "http";

import { config } from "./config";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { wsService } from "./services/websocket";

// Routes
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import challengeRoutes from "./routes/challenges";
import conversationRoutes from "./routes/conversations";
import documentRoutes from "./routes/documents";
import analyticsRoutes from "./routes/analytics";
import notificationRoutes from "./routes/notifications";
import recommendationRoutes from "./routes/recommendations";
import learningPathRoutes from "./routes/learningPath";
import reportRoutes from "./routes/reports";
import searchRoutes from "./routes/search";

const app = express();
const server = createServer(app);

// ─── Global Middleware ──────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(compression());
app.use(morgan(config.nodeEnv === "development" ? "dev" : "combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Static files for uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ─── Rate Limiting ──────────────────────────────────────────
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: { success: false, error: "Too many requests" },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

// Stricter limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, error: "Too many auth attempts" },
});
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// ─── Health Check ───────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv,
    wsClients: wsService.getOnlineCount(),
  });
});

// ─── API Routes ─────────────────────────────────────────────
const apiRouter = express.Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/users", userRoutes);
apiRouter.use("/challenges", challengeRoutes);
apiRouter.use("/conversations", conversationRoutes);
apiRouter.use("/documents", documentRoutes);
apiRouter.use("/analytics", analyticsRoutes);
apiRouter.use("/notifications", notificationRoutes);
apiRouter.use("/recommendations", recommendationRoutes);
apiRouter.use("/learning-path", learningPathRoutes);
apiRouter.use("/reports", reportRoutes);
apiRouter.use("/search", searchRoutes);

app.use("/api", apiRouter);

// ─── Error Handling ─────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ─── Start Server ───────────────────────────────────────────
wsService.initialize(server);

server.listen(config.port, () => {
  console.log(`
  ╔══════════════════════════════════════════════╗
  ║   AI Coding Mentor Backend                   ║
  ║   Running on http://localhost:${config.port}          ║
  ║   Environment: ${config.nodeEnv.padEnd(29)}║
  ║   WebSocket: ws://localhost:${config.port}/ws        ║
  ╚══════════════════════════════════════════════╝
  `);
});

export { app, server };
