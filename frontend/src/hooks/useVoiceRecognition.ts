import { useState, useEffect, useCallback } from 'react';

interface UseVoiceRecognitionReturn {
  isListening: boolean;
  transcript: string;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export const useVoiceRecognition = (): UseVoiceRecognitionReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Cross-browser setup for the Web Speech API
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Web Speech API is not supported in this browser.');
      return;
    }

    const recog = new SpeechRecognition();
    recog.continuous = false; // Stops listening automatically when the user finishes speaking a phrase
    recog.interimResults = false; // Only returns the final, high-confidence transcript
    recog.lang = 'en-US';

    // Update listening states based on native API cycle hooks
    recog.onstart = () => setIsListening(true);
    recog.onend = () => setIsListening(false);
    
    recog.onresult = (event: any) => {
      const resultText = event.results[0][0].transcript;
      setTranscript(resultText);
    };

    recog.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setError(event.error);
      setIsListening(false);
    };

    setRecognition(recog);
  }, []);

  const startListening = useCallback(() => {
    if (recognition) {
      setError(null);
      try {
        recognition.start();
      } catch (e) {
        console.error('Failed to start recognition:', e);
      }
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
    }
  }, [recognition]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
};