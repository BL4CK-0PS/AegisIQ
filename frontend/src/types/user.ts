export interface User {
  id: string;
  name: string;
  display_name?: string;
  email: string;
  role: "professional" | "capability_analyst" | "trainer" | "administrator";
  status?: "active" | "inactive" | "suspended";
  created_at: string;
  updated_at?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user_id: string;
  role: string;
  display_name: string;
}

export interface LoginResponse extends TokenResponse {}

export interface RegisterRequest {
  display_name: string;
  email: string;
  password: string;
  role?: string;
}
