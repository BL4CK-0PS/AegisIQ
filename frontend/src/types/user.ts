export interface User {
  id: string;
  name: string;
  email: string;
  role: "professional" | "capability_analyst" | "trainer" | "administrator";
  status: "active" | "inactive" | "suspended";
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: User;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}
