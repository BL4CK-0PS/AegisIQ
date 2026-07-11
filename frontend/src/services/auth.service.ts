import { apiClient } from "@/lib/api-client";
import type { LoginRequest, LoginResponse, RegisterRequest, User } from "@/types";

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>("/auth/login", data);
    return response.data;
  },

  async register(data: RegisterRequest): Promise<{ user_id: string; message: string }> {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get<User>("/auth/me");
    return response.data;
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
