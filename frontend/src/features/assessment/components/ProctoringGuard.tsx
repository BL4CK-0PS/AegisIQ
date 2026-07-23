import { useState } from "react";
import { Maximize, Monitor, Mic, ShieldCheck, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import type { ProctoringState } from "../hooks/useProctoring";

interface ProctoringGuardProps {
  children: React.ReactNode;
  proctoring: ProctoringState & {
    enterFullscreen: () => Promise<void>;
    startScreenShare: () => Promise<boolean>;
    startMic: () => Promise<boolean>;
  };
  onReady: () => void;
}

export function ProctoringGuard({ children, proctoring, onReady }: ProctoringGuardProps) {
  const [step, setStep] = useState<"consent" | "permissions" | "ready">("consent");
  const [micFailed, setMicFailed] = useState(false);
  const [screenFailed, setScreenFailed] = useState(false);

  if (proctoring.isLocked) {
    return (
      <div className="space-y-6">
        <Alert variant="error" title="Assessment Locked">
          You have exceeded the maximum allowed violations ({3}). This assessment has been
          automatically locked and your current answers have been submitted.
        </Alert>
        <Card variant="elevated">
          <CardContent className="py-8 text-center">
            <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-danger-400" />
            <p className="text-sm text-surface-400">
              Navigate to the report page to view your results.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "consent") {
    return (
      <div className="space-y-6">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck size={20} className="text-primary-400" />
              Assessment Integrity Check
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-surface-300">
              This assessment requires proctoring to ensure exam integrity. The following
              monitoring will be active during your session:
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { icon: Maximize, label: "Fullscreen Mode", desc: "Screen must remain in fullscreen" },
                { icon: Monitor, label: "Screen Recording", desc: "Entire monitor must be shared" },
                { icon: Mic, label: "Audio Monitoring", desc: "Microphone monitors ambient audio" },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-surface-700/50 p-3">
                  <item.icon size={18} className="mb-2 text-primary-400" />
                  <p className="text-xs font-medium text-surface-200">{item.label}</p>
                  <p className="text-[11px] text-surface-500">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-surface-500">
              Tab switching, clipboard usage, and context menu are restricted. Excessive violations
              will result in automatic submission.
            </p>
            <Button onClick={() => setStep("permissions")} className="w-full">
              Continue to Permissions
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "permissions") {
    const handleRequestPermissions = async () => {
      const micOk = await proctoring.startMic();
      setMicFailed(!micOk);

      const screenOk = await proctoring.startScreenShare();
      setScreenFailed(!screenOk);

      if (micOk) {
        await proctoring.enterFullscreen();
      }
      setStep("ready");
      onReady();
    };

    return (
      <div className="space-y-6">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Grant Permissions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-surface-300">
              Your browser will ask for microphone and screen sharing permissions. Please
              grant access to all requests and select your <strong>entire screen</strong> when
              prompted for screen sharing.
            </p>
            {(micFailed || screenFailed) && (
              <Alert variant="warning" title="Permission Denied">
                {micFailed && <p>Microphone access was denied. Audio monitoring is disabled.</p>}
                {screenFailed && <p>Screen sharing was denied or a window/tab was selected instead of the full monitor.</p>}
              </Alert>
            )}
            <Button onClick={handleRequestPermissions} className="w-full" leftIcon={<ShieldCheck size={16} />}>
              Grant Permissions & Start
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
