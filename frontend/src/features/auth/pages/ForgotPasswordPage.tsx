import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { apiClient } from "@/lib/api-client";

const forgotSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotForm = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotForm) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await apiClient.post("/auth/forgot-password", { email: data.email });
      setSent(true);
    } catch {
      setSent(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sent) {
    return (
      <Card variant="elevated">
        <div className="text-center">
          <CheckCircle className="mx-auto mb-4 h-12 w-12 text-cyber-400" />
          <h2 className="mb-2 text-xl font-bold text-surface-100">Check your email</h2>
          <p className="mb-6 text-sm text-surface-400">
            If an account exists with that email, you'll receive a password reset link shortly.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300"
          >
            <ArrowLeft size={16} />
            Back to sign in
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <h2 className="mb-2 text-2xl font-bold text-surface-100">Reset password</h2>
      <p className="mb-6 text-sm text-surface-400">
        Enter your email and we'll send you a reset link
      </p>

      {error && (
        <Alert variant="error" className="mb-4">{error}</Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          leftIcon={<Mail size={16} />}
          error={errors.email?.message}
          {...register("email")}
        />

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Send reset link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-surface-400">
        Remember your password?{" "}
        <Link to="/login" className="font-medium text-primary-400 hover:text-primary-300">
          Sign in
        </Link>
      </p>
    </Card>
  );
}
