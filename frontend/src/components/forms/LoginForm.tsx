import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (data: LoginFormValues) => void;
  isLoading?: boolean;
  error?: string;
}

export function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-danger-900/30 p-3 text-sm text-danger-300">
          {error}
        </div>
      )}
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        leftIcon={<Mail size={16} />}
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        leftIcon={<Lock size={16} />}
        error={errors.password?.message}
        {...register("password")}
      />
      <Button type="submit" className="w-full" isLoading={isLoading}>
        Sign in
      </Button>
    </form>
  );
}
