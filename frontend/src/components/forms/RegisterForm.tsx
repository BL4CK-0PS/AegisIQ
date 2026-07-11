import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSubmit: (data: RegisterFormValues) => void;
  isLoading?: boolean;
  error?: string;
}

export function RegisterForm({ onSubmit, isLoading, error }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-danger-900/30 p-3 text-sm text-danger-300">
          {error}
        </div>
      )}
      <Input
        label="Full name"
        placeholder="John Doe"
        leftIcon={<User size={16} />}
        error={errors.name?.message}
        {...register("name")}
      />
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
        placeholder="Create a password"
        leftIcon={<Lock size={16} />}
        error={errors.password?.message}
        {...register("password")}
      />
      <Input
        label="Confirm password"
        type="password"
        placeholder="Confirm your password"
        leftIcon={<Lock size={16} />}
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      <Button type="submit" className="w-full" isLoading={isLoading}>
        Create account
      </Button>
    </form>
  );
}
