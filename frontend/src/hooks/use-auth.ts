import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";
import { authService } from "@/services/auth.service";
import type { LoginRequest, RegisterRequest, TokenResponse, User } from "@/types";

function userFromToken(res: TokenResponse): User {
  return {
    id: res.user_id,
    name: res.display_name,
    email: "",
    role: res.role as User["role"],
    status: "active",
    created_at: "",
  };
}

export function useAuth() {
  const { user, isAuthenticated, setUser, login, logout, setLoading } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: currentUser, isLoading: isMeLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authService.getMe,
    enabled: isAuthenticated,
    retry: false,
  });

  useEffect(() => {
    setLoading(isMeLoading);
  }, [isMeLoading, setLoading]);

  useEffect(() => {
    if (currentUser) {
      setUser({
        id: currentUser.id,
        name: currentUser.display_name ?? currentUser.name,
        display_name: currentUser.display_name,
        email: currentUser.email,
        role: currentUser.role,
        status: currentUser.status ?? "active",
        created_at: currentUser.created_at,
        updated_at: currentUser.updated_at ?? "",
      });
    }
  }, [currentUser, setUser]);

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      const tokenUser = userFromToken(response);
      login(tokenUser, response.access_token, response.refresh_token);
      queryClient.setQueryData(["auth", "me"], tokenUser);
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      navigate("/dashboard");
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: () => {
      navigate("/login");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      logout();
      queryClient.clear();
      navigate("/login");
    },
  });

  return {
    user,
    isAuthenticated,
    isLoading: isMeLoading,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoginPending: loginMutation.isPending,
    isRegisterPending: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
}
