import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Send } from "lucide-react";

export default function MentorChat() {
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

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask your mentor..."
            className="flex-1 rounded-md border bg-background px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
