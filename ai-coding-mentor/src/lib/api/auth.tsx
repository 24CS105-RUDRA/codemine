"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { api } from "./client";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  learningGoal?: string;
  preferredLang?: string;
  dailyGoal?: number;
  theme?: string;
  aiResponseStyle?: string;
  aiExplanationLevel?: string;
  aiMentorPersonality?: string;
  profile?: {
    currentStreak: number;
    maxStreak: number;
    totalSolved: number;
    accuracy: number;
    totalHours: number;
    level: string;
    xp: number;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get("/auth/me");
      if (res.success) {
        setUser(res.data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    if (res.success) {
      api.setAuth(res.data.accessToken, res.data.refreshToken);
      setUser(res.data.user);
    } else {
      throw new Error(res.error || "Login failed");
    }
  };

  const register = async (email: string, name: string, password: string) => {
    const res = await api.post("/auth/register", { email, name, password });
    if (res.success) {
      api.setAuth(res.data.accessToken, res.data.refreshToken);
      setUser(res.data.user);
    } else {
      throw new Error(res.error || "Registration failed");
    }
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
