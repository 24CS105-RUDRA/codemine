import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { JwtPayload } from "../types";

interface ConnectedClient {
  ws: WebSocket;
  userId: string;
  lastPing: number;
}

export class WebSocketService {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, ConnectedClient[]> = new Map();

  initialize(server: Server) {
    this.wss = new WebSocketServer({ server, path: "/ws" });

    this.wss.on("connection", (ws, req) => {
      const token = new URL(req.url!, `http://${req.headers.host}`).searchParams.get("token");

      if (!token) {
        ws.close(1008, "Authentication required");
        return;
      }

      try {
        const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
        const userId = decoded.sub;

        const client: ConnectedClient = { ws, userId, lastPing: Date.now() };

        if (!this.clients.has(userId)) {
          this.clients.set(userId, []);
        }
        this.clients.get(userId)!.push(client);

        console.log(`[WS] Client connected: ${userId}`);

        ws.on("message", (data) => {
          try {
            const message = JSON.parse(data.toString());
            this.handleMessage(userId, message);
          } catch {}
        });

        ws.on("pong", () => {
          client.lastPing = Date.now();
        });

        ws.on("close", () => {
          const userClients = this.clients.get(userId);
          if (userClients) {
            const idx = userClients.indexOf(client);
            if (idx !== -1) userClients.splice(idx, 1);
            if (userClients.length === 0) this.clients.delete(userId);
          }
          console.log(`[WS] Client disconnected: ${userId}`);
        });

        ws.on("error", (error) => {
          console.error(`[WS] Error for ${userId}:`, error.message);
        });

        // Send welcome message
        ws.send(JSON.stringify({ type: "connected", message: "Connected to AI Coding Mentor" }));
      } catch {
        ws.close(1008, "Invalid token");
      }
    });

    // Heartbeat to detect stale connections
    const interval = setInterval(() => {
      this.wss?.clients.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.ping();
        }
      });
    }, 30000);

    this.wss.on("close", () => clearInterval(interval));

    console.log("[WS] WebSocket server initialized");
  }

  private handleMessage(userId: string, message: any) {
    switch (message.type) {
      case "ping":
        this.sendToUser(userId, { type: "pong", timestamp: Date.now() });
        break;
      case "typing":
        // Could broadcast to AI service
        break;
    }
  }

  sendToUser(userId: string, data: any) {
    const clients = this.clients.get(userId);
    if (clients) {
      const message = JSON.stringify(data);
      clients.forEach((client) => {
        if (client.ws.readyState === WebSocket.OPEN) {
          client.ws.send(message);
        }
      });
    }
  }

  broadcast(data: any) {
    const message = JSON.stringify(data);
    this.clients.forEach((clients) => {
      clients.forEach((client) => {
        if (client.ws.readyState === WebSocket.OPEN) {
          client.ws.send(message);
        }
      });
    });
  }

  getConnectedUsers(): string[] {
    return Array.from(this.clients.keys());
  }

  getOnlineCount(): number {
    return this.clients.size;
  }
}

export const wsService = new WebSocketService();
