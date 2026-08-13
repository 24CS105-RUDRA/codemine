import { Request } from "express";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
  type: "access" | "refresh";
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  sort?: string;
  order?: "asc" | "desc";
  search?: string;
}

export interface CodeExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  runtime: number;
  memory: number;
  timedOut: boolean;
}

export interface AIChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}
