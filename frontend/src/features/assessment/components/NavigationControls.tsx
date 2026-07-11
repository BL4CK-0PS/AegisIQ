import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface NavigationControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  isLast: boolean;
}

export function NavigationControls({
  onPrevious,
  onNext,
  hasPrevious,
  isLast,
}: NavigationControlsProps) {
  return (
    <div className="flex items-center justify-between">
      <Button
        variant="ghost"
        onClick={onPrevious}
        disabled={!hasPrevious}
        leftIcon={<ArrowLeft size={16} />}
      >
        Previous
      </Button>
      <Button
        onClick={onNext}
        rightIcon={isLast ? <CheckCircle size={16} /> : <ArrowRight size={16} />}
      >
        {isLast ? "Complete" : "Next"}
      </Button>
    </div>
  );
}
