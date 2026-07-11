import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

const messages = [
  {
    role: "mentor",
    content:
      "Welcome! I'm your AI security mentor. Based on your recent assessments, I recommend focusing on Threat Hunting next. Would you like a study plan?",
  },
  {
    role: "user",
    content: "Yes, I'd love a plan for Threat Hunting. Where should I start?",
  },
  {
    role: "mentor",
    content:
      "Start with understanding the MITRE ATT&CK framework, then move to hypothesis-driven hunting using SIEM queries. I've added a relevant lab to your recommendations.",
  },
];

export default function MentorChat() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Mentor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="max-h-64 space-y-3 overflow-y-auto">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "flex gap-2",
                msg.role === "user" && "flex-row-reverse"
              )}
            >
              <div
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                  msg.role === "mentor"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {msg.role === "mentor" ? (
                  <Bot className="h-3 w-3" />
                ) : (
                  <User className="h-3 w-3" />
                )}
              </div>
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-3 py-2 text-xs leading-relaxed",
                  msg.role === "mentor"
                    ? "bg-muted"
                    : "bg-primary text-primary-foreground"
                )}
              >
                {msg.content}
              </div>
            </div>
          ))}
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
