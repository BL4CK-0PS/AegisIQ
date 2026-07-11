import { useState } from "react";
import { Send } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface AnswerEditorProps {
  onSubmit: (answer: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function AnswerEditor({ onSubmit, isLoading, disabled }: AnswerEditorProps) {
  const [answer, setAnswer] = useState("");

  const handleSubmit = () => {
    if (answer.trim()) {
      onSubmit(answer.trim());
      setAnswer("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle className="text-sm">Text Response</CardTitle>
      </CardHeader>
      <div className="space-y-3">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Type your answer here... (Ctrl+Enter to submit)"
          rows={6}
          className="w-full resize-none rounded-lg border border-surface-600 bg-surface-800 px-4 py-3 text-sm text-surface-100 placeholder:text-surface-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-surface-500">
            {answer.length} characters
          </span>
          <Button
            onClick={handleSubmit}
            disabled={!answer.trim() || disabled}
            isLoading={isLoading}
            size="sm"
            rightIcon={<Send size={14} />}
          >
            Submit
          </Button>
        </div>
      </div>
    </Card>
  );
}
