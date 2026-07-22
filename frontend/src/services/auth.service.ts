import { apiClient } from "@/lib/api-client";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  TokenResponse,
  User,
} from "@/types";

function extractErrorDetail(error: unknown): string {
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "data" in error.response &&
    error.response.data &&
    typeof error.response.data === "object" &&
    "detail" in error.response.data
  ) {
    const detail = error.response.data.detail;
    if (typeof detail === "string") {
      return detail;
    }
    if (Array.isArray(detail)) {
      return detail
        .map((item: { msg?: string; type?: string }) => item.msg ?? item.type ?? "")
        .filter(Boolean)
        .join("; ");
    }
  }
  return "";
}

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>("/auth/login", data);
    return response.data;
  },

  async register(data: RegisterRequest): Promise<TokenResponse> {
    const response = await apiClient.post<TokenResponse>("/auth/register", {
      display_name: data.display_name,
      email: data.email,
      password: data.password,
      role: data.role ?? "professional",
    });
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get("/auth/me");
    const raw = response.data;
    return {
      id: raw.id,
      name: raw.display_name ?? raw.name ?? "",
      display_name: raw.display_name,
      email: raw.email,
      role: raw.role,
      status: raw.status ?? "active",
      created_at: raw.created_at ?? "",
      updated_at: raw.updated_at ?? "",
    };
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  },

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>("/auth/refresh", {
      refresh_token: refreshToken,
    });
    return response.data;
  },
};

export { extractErrorDetail };
