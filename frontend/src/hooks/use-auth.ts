import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";
import { authService } from "@/services/auth.service";
import type { LoginRequest, RegisterRequest } from "@/types";

export function useAuth() {
  const { user, isAuthenticated, setUser, login, logout } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: currentUser, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authService.getMe,
    enabled: isAuthenticated,
    retry: false,
  });

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    }
  }, [currentUser, setUser]);

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      login(response.user, response.access_token, response.refresh_token);
      queryClient.setQueryData(["auth", "me"], response.user);
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
    isLoading,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoginPending: loginMutation.isPending,
    isRegisterPending: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
}
