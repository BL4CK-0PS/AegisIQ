import { useState, useRef, useCallback, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export function VoiceInput({ onTranscript, disabled }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const supported = typeof window !== "undefined" && "webkitSpeechRecognition" in window;
    setIsSupported(supported);
  }, []);

  const toggleListening = useCallback(() => {
    if (!isSupported) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as unknown as Record<string, any>).webkitSpeechRecognition;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition: any = new SR();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result && result.isFinal) {
          finalText += result[0]?.transcript ?? "";
        }
      }
      if (finalText) {
        onTranscript(finalText);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening, isSupported, onTranscript]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={toggleListening}
      disabled={disabled}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg border transition-colors",
        isListening
          ? "border-danger-500 bg-danger-900/30 text-danger-400 animate-pulse"
          : "border-surface-600 bg-surface-700 text-surface-300 hover:bg-surface-600",
        disabled && "pointer-events-none opacity-50",
      )}
      title={isListening ? "Stop dictation" : "Start voice dictation"}
    >
      {isListening ? <MicOff size={14} /> : <Mic size={14} />}
    </button>
  );
}
