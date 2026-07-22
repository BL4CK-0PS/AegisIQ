import { useNavigate } from "react-router-dom";
import { Shield, ArrowRight, Target, Brain, BarChart3, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { Mic, MicOff, RefreshCw } from "lucide-react";
import { useVoiceRecognition } from "../hooks/useVoiceRecognition";
import { sendVoiceTranscript } from "../services/aiService";

export default function LandingPage() {
  const navigate = useNavigate();
  // Sprint 2 Voice States & Hooks
  const {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceRecognition();

  const [aiResponse, setAiResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [manualInput, setManualInput] = useState('');

  const handleProcessVoiceInput = async () => {
    const queryText = transcript || manualInput;
    if (!queryText) return;

    setIsLoading(true);
    try {
      const data = await sendVoiceTranscript(queryText, "medium");
      setAiResponse(data);
    } catch (err) {
      console.error("Sprint 2 Roundtrip failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Target,
      title: "Adaptive Assessment",
      description: "Dynamic cybersecurity capability assessment that adapts to your responses in real-time.",
    },
    {
      icon: Brain,
      title: "Capability Reasoning",
      description: "AI-powered evaluation of your cybersecurity thinking and decision-making processes.",
    },
    {
      icon: BarChart3,
      title: "Explainable Reports",
      description: "Every score backed by evidence with clear strengths, weaknesses, and recommendations.",
    },
    {
      icon: Fingerprint,
      title: "Skill DNA Profile",
      description: "Your unique cybersecurity capability fingerprint that evolves with every assessment.",
    },
  ];

  return (
    <div className="min-h-screen bg-surface-950">
      <nav className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary-500" />
          <span className="text-xl font-bold text-surface-100">PWNDORA</span>
          <span className="text-xs font-medium text-primary-400">SkillScan X</span>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
        </div>
      </nav>

      <section className="flex flex-col items-center px-8 py-24 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-700/30 bg-primary-900/20 px-4 py-1.5 text-sm text-primary-300">
          Adaptive Cybersecurity Capability Intelligence
        </div>
        <h1 className="mb-6 max-w-4xl text-5xl font-bold leading-tight text-surface-100">
          We do not assess resumes.
          <br />
          <span className="text-primary-400">We assess cybersecurity capability.</span>
        </h1>
        <p className="mb-10 max-w-2xl text-lg text-surface-400">
          PWNDORA SkillScan X evaluates your real cybersecurity skills through adaptive
          practical challenges, AI-powered reasoning evaluation, and explainable capability scoring.
        </p>
        <div className="flex items-center gap-4">
          <Button size="lg" onClick={() => navigate("/dashboard")} rightIcon={<ArrowRight size={18} />}>
            Go to Dashboard
          </Button>
        </div>
      </section>
{/* SPRINT 2 VOICE INTEGRATION PLAYGROUND */}
      <section className="mx-auto max-w-3xl px-8 py-12">
        <div className="rounded-2xl border border-primary-500/20 bg-surface-900/50 p-8 shadow-2xl backdrop-blur-sm">
          <div className="mb-6 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-400">Sprint 2 Demo</span>
            <h2 className="text-2xl font-bold mt-1 text-surface-100">Voice Capability Sandbox</h2>
            <p className="text-sm text-surface-400 mt-1">Test your live Web Speech API audio capturing and AI fallback routes below.</p>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center space-y-3">
              <button
                onClick={isListening ? stopListening : startListening}
                className={`flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300 ${
                  isListening 
                    ? "bg-red-500 hover:bg-red-600 animate-pulse shadow-lg shadow-red-500/30" 
                    : "bg-primary-500 hover:bg-primary-600 shadow-lg shadow-primary-500/20"
                }`}
              >
                {isListening ? <MicOff className="h-7 w-7 text-white" /> : <Mic className="h-7 w-7 text-white" />}
              </button>
              <span className="text-xs font-semibold uppercase tracking-wider text-surface-400">
                {isListening ? "Listening active... Speak now" : "Click to start recording"}
              </span>
            </div>

            <div className="rounded-xl border border-surface-800 bg-surface-950 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold tracking-wide uppercase text-primary-400">Real-Time Transcript</span>
                {(transcript || error) && (
                  <button onClick={resetTranscript} className="text-xs text-surface-500 hover:text-surface-300 flex items-center gap-1">
                    <RefreshCw size={12} /> Clear
                  </button>
                )}
              </div>
              <p className="min-h-[48px] text-sm text-surface-200 italic leading-relaxed">
                {transcript ? `"${transcript}"` : "Your voice transcript will appear here instantly as you speak..."}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold tracking-wide uppercase text-primary-400 block">
                Manual Text Input Fallback
              </label>
              <input
                type="text"
                placeholder="Or type manually in case mic authorization is disabled..."
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                className="w-full rounded-lg border border-surface-800 bg-surface-950 p-3 text-sm text-surface-100 placeholder-surface-600 outline-none focus:border-primary-500 transition-colors"
              />
            </div>

            <Button
              className="w-full py-3"
              disabled={isLoading || (!transcript && !manualInput)}
              onClick={handleProcessVoiceInput}
            >
              {isLoading ? "Generating with Fallback AI Pipeline..." : "Process with Multi-Tier AI"}
            </Button>

            {error && (
              <p className="text-center text-xs font-semibold text-red-400 bg-red-950/20 py-2 rounded-lg border border-red-500/10">
                System Error: {error}
              </p>
            )}

            {aiResponse && (
              <div className="rounded-xl border border-green-500/20 bg-green-950/10 p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-400 animate-ping" />
                  <span className="text-xs font-bold text-green-400 uppercase tracking-wide">
                    Generation Successful ({aiResponse.source})
                  </span>
                </div>
                <div className="text-sm font-semibold text-surface-100 mt-2">
                  Generated Cybersecurity Scenario:
                </div>
                <pre className="text-xs overflow-auto max-h-48 text-surface-300 bg-surface-950 p-3 rounded-lg border border-surface-800 leading-relaxed font-mono">
                  {JSON.stringify(aiResponse.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-8 py-20">
        <h2 className="mb-12 text-center text-3xl font-bold text-surface-100">
          How It Works
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-surface-700/50 bg-surface-800/30 p-6 transition-colors hover:border-surface-600 hover:bg-surface-800/50"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-900/30">
                <feature.icon className="h-6 w-6 text-primary-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-surface-100">{feature.title}</h3>
              <p className="text-sm text-surface-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-surface-800 px-8 py-16 text-center">
        <h2 className="mb-4 text-3xl font-bold text-surface-100">
          Ready to discover your Skill DNA?
        </h2>
        <p className="mb-8 text-surface-400">
          Join professionals who are transforming how cybersecurity capability is evaluated.
        </p>
        <Button size="lg" onClick={() => navigate("/dashboard")} rightIcon={<ArrowRight size={18} />}>
          Get Started
        </Button>
      </section>

      <footer className="border-t border-surface-800 px-8 py-6 text-center text-sm text-surface-500">
        PWNDORA SkillScan X &copy; {new Date().getFullYear()} &middot; Adaptive Cybersecurity Capability Intelligence
      </footer>
    </div>
  );
}
