import { useNavigate } from "react-router-dom";
import { Shield, ArrowRight, Target, Brain, BarChart3, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  const navigate = useNavigate();

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
          <span className="text-xl font-bold text-surface-100">AegisIQ</span>
          <span className="text-xs font-medium text-primary-400"></span>
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
          AegisIQ evaluates your real cybersecurity skills through adaptive
          practical challenges, AI-powered reasoning evaluation, and explainable capability scoring.
        </p>
        <div className="flex items-center gap-4">
          <Button size="lg" onClick={() => navigate("/dashboard")} rightIcon={<ArrowRight size={18} />}>
            Go to Dashboard
          </Button>
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
        AegisIQ &copy; {new Date().getFullYear()} &middot; Adaptive Cybersecurity Capability Intelligence
      </footer>
    </div>
  );
}
