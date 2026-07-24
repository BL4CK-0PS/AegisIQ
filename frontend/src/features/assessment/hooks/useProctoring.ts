import { useState, useEffect, useRef, useCallback } from "react";

export interface ProctorViolation {
  type: "tab_switch" | "fullscreen_exit" | "screen_share_stopped" | "clipboard_attempt" | "context_menu" | "audio_anomaly";
  timestamp: number;
  detail: string;
}

export interface ProctoringState {
  isFullscreen: boolean;
  isScreenSharing: boolean;
  isMicActive: boolean;
  isTabFocused: boolean;
  violations: ProctorViolation[];
  violationCount: number;
  isLocked: boolean;
  integrityScore: number;
  audioLevel: number;
  requestedPermissions: { mic: boolean; screen: boolean };
}

const MAX_VIOLATIONS = 3;
const VIOLATION_PENALTY = 15;

function buildViolation(type: ProctorViolation["type"], detail: string): ProctorViolation {
  return { type, timestamp: Date.now(), detail };
}

export function useProctoring(assessmentId: string) {
  const [state, setState] = useState<ProctoringState>({
    isFullscreen: false,
    isScreenSharing: false,
    isMicActive: false,
    isTabFocused: document.hasFocus(),
    violations: [],
    violationCount: 0,
    isLocked: false,
    integrityScore: 100,
    audioLevel: 0,
    requestedPermissions: { mic: false, screen: false },
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number>(0);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const violationCountRef = useRef(0);

  const addViolation = useCallback(
    (type: ProctorViolation["type"], detail: string) => {
      setState((prev) => {
        if (prev.isLocked) return prev;
        const v = buildViolation(type, detail);
        const newCount = prev.violationCount + 1;
        const isLocked = newCount >= MAX_VIOLATIONS;
        return {
          ...prev,
          violations: [...prev.violations, v],
          violationCount: newCount,
          isLocked,
          integrityScore: Math.max(0, 100 - newCount * VIOLATION_PENALTY),
        };
      });
    },
    [],
  );

  useEffect(() => {
    violationCountRef.current = state.violationCount;
  }, [state.violationCount]);

  const addViolationRef = useRef(addViolation);
  addViolationRef.current = addViolation;

  // --- Fullscreen ---
  const enterFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen();
      setState((prev) => ({ ...prev, isFullscreen: true }));
    } catch {
      setState((prev) => ({ ...prev, isFullscreen: false }));
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = !!document.fullscreenElement;
      setState((prev) => ({ ...prev, isFullscreen: isFs }));
      if (!isFs && !state.isLocked) {
        addViolationRef.current("fullscreen_exit", "Exited fullscreen mode");
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [state.isLocked]);

  // --- Screen Share ---
  const startScreenShare = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: "monitor" } as MediaTrackConstraints,
        audio: false,
      });
      screenStreamRef.current = stream;

      const track = stream.getVideoTracks()[0];
      if (!track) {
        stream.getTracks().forEach((t) => t.stop());
        setState((prev) => ({ ...prev, isScreenSharing: false }));
        return false;
      }
      const surfaceType = (track.getSettings() as Record<string, string>).displaySurface;

      if (surfaceType !== "monitor") {
        track.stop();
        screenStreamRef.current = null;
        addViolationRef.current("screen_share_stopped", "Shared a window or tab instead of entire monitor");
        setState((prev) => ({ ...prev, isScreenSharing: false, requestedPermissions: { ...prev.requestedPermissions, screen: false } }));
        return false;
      }

      track.onended = () => {
        setState((prev) => ({ ...prev, isScreenSharing: false }));
        addViolationRef.current("screen_share_stopped", "Screen sharing was stopped");
      };

      setState((prev) => ({ ...prev, isScreenSharing: true, requestedPermissions: { ...prev.requestedPermissions, screen: true } }));
      return true;
    } catch {
      setState((prev) => ({ ...prev, isScreenSharing: false, requestedPermissions: { ...prev.requestedPermissions, screen: false } }));
      return false;
    }
  }, []);

  // --- Microphone / Audio Level ---
  const startMic = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const ctx = new AudioContext();
      audioContextRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.start(1000);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let highAudioFrames = 0;
      const threshold = 180;

      const checkLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setState((prev) => ({ ...prev, audioLevel: avg }));

        if (avg > threshold) {
          highAudioFrames++;
          if (highAudioFrames > 30) {
            addViolationRef.current("audio_anomaly", `Prolonged high audio detected (level: ${Math.round(avg)})`);
            highAudioFrames = 0;
          }
        } else {
          highAudioFrames = Math.max(0, highAudioFrames - 1);
        }
        animFrameRef.current = requestAnimationFrame(checkLevel);
      };
      animFrameRef.current = requestAnimationFrame(checkLevel);

      setState((prev) => ({ ...prev, isMicActive: true, requestedPermissions: { ...prev.requestedPermissions, mic: true } }));
      return true;
    } catch {
      setState((prev) => ({ ...prev, isMicActive: false, requestedPermissions: { ...prev.requestedPermissions, mic: false } }));
      return false;
    }
  }, []);

  const stopMic = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    mediaRecorderRef.current?.stop();
    micStreamRef.current?.getTracks().forEach((t) => t.stop());
    audioContextRef.current?.close();
    setState((prev) => ({ ...prev, isMicActive: false, audioLevel: 0 }));
  }, []);

  const getAudioChunks = useCallback(() => audioChunksRef.current, []);

  // --- Tab Focus ---
  useEffect(() => {
    const GRACE_MS = 3000;
    let hiddenTimer: ReturnType<typeof setTimeout> | null = null;
    let cooldownTimer: ReturnType<typeof setTimeout> | null = null;

    const handleVisibility = () => {
      const focused = document.visibilityState === "visible";
      setState((prev) => ({ ...prev, isTabFocused: focused }));

      if (focused) {
        if (hiddenTimer) {
          clearTimeout(hiddenTimer);
          hiddenTimer = null;
        }
      } else if (!hiddenTimer && !cooldownTimer) {
        hiddenTimer = setTimeout(() => {
          hiddenTimer = null;
          addViolationRef.current("tab_switch", "Tab hidden for >3 seconds");
          cooldownTimer = setTimeout(() => { cooldownTimer = null; }, GRACE_MS);
        }, GRACE_MS);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      if (hiddenTimer) clearTimeout(hiddenTimer);
      if (cooldownTimer) clearTimeout(cooldownTimer);
    };
  }, []);

  // --- Clipboard & Context Menu Restrictions ---
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("[data-proctoring-zone]")) {
        e.preventDefault();
        addViolationRef.current("context_menu", "Right-click blocked in assessment zone");
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!(e.target as HTMLElement).closest("[data-proctoring-zone]")) return;
      const mod = e.metaKey || e.ctrlKey;
      if (mod && (e.key === "c" || e.key === "v" || e.key === "C" || e.key === "V")) {
        e.preventDefault();
        addViolationRef.current("clipboard_attempt", `Clipboard ${e.key.toLowerCase() === "c" ? "copy" : "paste"} blocked`);
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // --- Cleanup ---
  useEffect(() => {
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      mediaRecorderRef.current?.stop();
      micStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      audioContextRef.current?.close();
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    };
  }, []);

  const getProctoringSummary = useCallback(() => ({
    assessment_id: assessmentId,
    violation_count: state.violationCount,
    violations: state.violations,
    integrity_score: state.integrityScore,
    cheating_risk_flagged: state.isLocked,
    tab_switches: state.violations.filter((v) => v.type === "tab_switch").length,
    fullscreen_exits: state.violations.filter((v) => v.type === "fullscreen_exit").length,
    screen_share_stops: state.violations.filter((v) => v.type === "screen_share_stopped").length,
    audio_anomalies: state.violations.filter((v) => v.type === "audio_anomaly").length,
    clipboard_attempts: state.violations.filter((v) => v.type === "clipboard_attempt").length,
    context_menu_blocks: state.violations.filter((v) => v.type === "context_menu").length,
    voice_enabled: state.requestedPermissions.mic,
  }), [assessmentId, state]);

  return {
    ...state,
    enterFullscreen,
    exitFullscreen,
    startScreenShare,
    startMic,
    stopMic,
    getAudioChunks,
    getProctoringSummary,
    addViolation,
  };
}
