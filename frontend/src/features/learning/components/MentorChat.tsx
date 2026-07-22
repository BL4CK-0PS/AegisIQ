import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Send } from "lucide-react";

const chatSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(500, "Message must be under 500 characters"),
});

type ChatForm = z.infer<typeof chatSchema>;

export default function MentorChat() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ChatForm>({
    resolver: zodResolver(chatSchema),
  });

  const messageValue = watch("message", "");

  const onSubmit = (_data: ChatForm) => {
    reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Mentor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="max-h-64 flex items-center justify-center py-8">
          <p className="text-sm text-muted-foreground text-center">
            Start a conversation with your AI mentor. Complete an assessment first to get personalized guidance.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              {...register("message")}
              placeholder="Ask your mentor..."
              className="flex-1 rounded-md border border-surface-600 bg-surface-800 px-3 py-1.5 text-xs text-surface-100 placeholder:text-surface-500 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
            <Button
              type="submit"
              size="sm"
              disabled={!messageValue.trim()}
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
          {errors.message && (
            <p className="text-xs text-danger-400">{errors.message.message}</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
