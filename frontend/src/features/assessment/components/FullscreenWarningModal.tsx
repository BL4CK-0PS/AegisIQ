import { Maximize, AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface FullscreenWarningModalProps {
  isOpen: boolean;
  onReenterFullscreen: () => void;
  violationCount: number;
}

export function FullscreenWarningModal({
  isOpen,
  onReenterFullscreen,
  violationCount,
}: FullscreenWarningModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={() => {}} title="Fullscreen Required">
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-warning-900/30">
          <AlertTriangle className="h-7 w-7 text-warning-400" />
        </div>
        <p className="text-sm text-surface-300">
          You exited fullscreen mode. Please return to fullscreen to continue the assessment.
        </p>
        <p className="text-xs text-surface-500">
          Violation {violationCount}/{3} — {3 - violationCount} warning{3 - violationCount !== 1 ? "s" : ""} remaining before auto-submit.
        </p>
        <Button onClick={onReenterFullscreen} leftIcon={<Maximize size={16} />} className="w-full">
          Re-enter Fullscreen
        </Button>
      </div>
    </Modal>
  );
}
