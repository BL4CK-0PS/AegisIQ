import { Mic, MicOff, Square } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useVoiceRecorder } from "@/hooks";

interface VoiceRecorderProps {
  onTranscript: (transcript: string) => void;
}

export function VoiceRecorder({ onTranscript }: VoiceRecorderProps) {
  const { isRecording, transcript, startRecording, stopRecording, error, isSupported } =
    useVoiceRecorder();

  const handleStop = () => {
    stopRecording();
    if (transcript) onTranscript(transcript);
  };

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle className="text-sm">Voice Input</CardTitle>
      </CardHeader>
      <div className="flex flex-col items-center gap-4 pb-4">
        {!isSupported ? (
          <p className="text-sm text-surface-500">Voice input not supported in this browser</p>
        ) : (
          <>
            <button
              onClick={isRecording ? handleStop : startRecording}
              className={`flex h-16 w-16 items-center justify-center rounded-full transition-all ${
                isRecording
                  ? "animate-pulse bg-danger-600 text-white shadow-lg shadow-danger-600/30"
                  : "bg-primary-600 text-white hover:bg-primary-700"
              }`}
            >
              {isRecording ? <Square size={24} /> : <Mic size={24} />}
            </button>
            <p className="text-xs text-surface-400">
              {isRecording ? "Click to stop recording" : "Click to start recording"}
            </p>
          </>
        )}
        {error && <p className="text-xs text-danger-400">{error}</p>}
        {transcript && (
          <div className="w-full rounded-lg bg-surface-800/50 p-3">
            <p className="text-sm text-surface-300">{transcript}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
