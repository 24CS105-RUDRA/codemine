import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { AuthUser, AuthRequest, JwtPayload } from "../types";
import prisma from "./prisma";

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, error: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

    if (decoded.type !== "access") {
      return res.status(401).json({ success: false, error: "Invalid token type" });
    }

    req.user = {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ success: false, error: "Token expired" });
    }
    return res.status(401).json({ success: false, error: "Invalid token" });
  }
}

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    if (decoded.type === "access") {
      req.user = {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role,
      };
    }
  } catch {
    // Ignore invalid tokens for optional auth
  }

  next();
}

export function authorize(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }
    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: "Insufficient permissions" });
    }
    next();
  };
}

export function generateTokens(user: AuthUser) {
  const accessPayload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    type: "access" as const,
  };

  const refreshPayload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    type: "refresh" as const,
  };

  const accessToken = jwt.sign(accessPayload, config.jwt.secret, { expiresIn: "15m" });

  const refreshToken = jwt.sign(refreshPayload, config.jwt.refreshSecret, { expiresIn: "7d" });

  return { accessToken, refreshToken };
}

export async function verifyRefreshToken(token: string) {
  try {
    const decoded = jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;

    if (decoded.type !== "refresh") {
      return null;
    }

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}
