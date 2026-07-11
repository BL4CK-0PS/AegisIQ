import { Card } from "@/components/ui/Card";

interface Question {
  id: string;
  text: string;
  type: "open_ended" | "multiple_choice" | "practical";
}

interface QuestionCardProps {
  question: Question;
}

export function QuestionCard({ question }: QuestionCardProps) {
  return (
    <div className="py-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="rounded bg-primary-900/30 px-2 py-0.5 text-xs font-medium text-primary-400">
          Question
        </span>
        <span className="rounded bg-surface-700 px-2 py-0.5 text-xs text-surface-300">
          {question.type.replace("_", " ")}
        </span>
      </div>
      <h3 className="text-base font-medium text-surface-100">{question.text}</h3>
    </div>
  );
}
