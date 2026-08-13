const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

interface FetchOptions extends RequestInit {
  token?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  }

  private getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("refreshToken");
  }

  private setTokens(access: string, refresh: string) {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
  }

  private clearTokens() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  private async refreshAccessToken(): Promise<string | null> {
    const refresh = this.getRefreshToken();
    if (!refresh) return null;

    try {
      const res = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: refresh }),
      });
      const data = await res.json();
      if (data.success) {
        this.setTokens(data.data.accessToken, data.data.refreshToken);
        return data.data.accessToken;
      }
    } catch {}
    return null;
  }

  async request<T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { token, ...fetchOptions } = options;
    const authToken = token || this.getToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((fetchOptions.headers as Record<string, string>) || {}),
    };

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    let res = await fetch(`${this.baseUrl}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    // If 401, try refreshing token
    if (res.status === 401 && !endpoint.includes("/auth/")) {
      const newToken = await this.refreshAccessToken();
      if (newToken) {
        headers["Authorization"] = `Bearer ${newToken}`;
        res = await fetch(`${this.baseUrl}${endpoint}`, {
          ...fetchOptions,
          headers,
        });
      } else {
        this.clearTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/landing";
        }
      }
    }

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Request failed");
    }
    return data;
  }

  // Convenience methods
  get<T = any>(endpoint: string, options?: FetchOptions) {
    return this.request<T>(endpoint, { method: "GET", ...options });
  }

  post<T = any>(endpoint: string, body?: any, options?: FetchOptions) {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
  }

  put<T = any>(endpoint: string, body?: any, options?: FetchOptions) {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
  }

  delete<T = any>(endpoint: string, options?: FetchOptions) {
    return this.request<T>(endpoint, { method: "DELETE", ...options });
  }

  async upload<T = any>(endpoint: string, formData: FormData): Promise<T> {
    const authToken = this.getToken();
    const headers: Record<string, string> = {};
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers,
      body: formData,
    });

    return res.json();
  }

  // Auth helpers
  setAuth(access: string, refresh: string) {
    this.setTokens(access, refresh);
  }

  logout() {
    this.clearTokens();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const api = new ApiClient(API_BASE);
