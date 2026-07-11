import { useState, useCallback, useRef } from "react";

interface UseVoiceRecorderReturn {
  isRecording: boolean;
  transcript: string;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  resetTranscript: () => void;
  error: string | null;
  isSupported: boolean;
}

export function useVoiceRecorder(): UseVoiceRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const isSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const startRecording = useCallback(async () => {
    if (!isSupported) {
      setError("Speech recognition is not supported in this browser");
      return;
    }

    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript((prev) => (prev ? prev + " " + finalTranscript : finalTranscript));
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);
      setError(null);
    } catch (err) {
      setError("Failed to start speech recognition");
      setIsRecording(false);
    }
  }, [isSupported]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript("");
  }, []);

  return {
    isRecording,
    transcript,
    startRecording,
    stopRecording,
    resetTranscript,
    error,
    isSupported,
  };
}
