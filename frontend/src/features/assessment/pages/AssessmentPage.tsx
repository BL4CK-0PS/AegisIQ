import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressTracker } from "../components/ProgressTracker";
import { Timer } from "../components/Timer";
import { QuestionCard } from "../components/QuestionCard";
import { VoiceRecorder } from "../components/VoiceRecorder";
import { TranscriptPanel } from "../components/TranscriptPanel";
import { NavigationControls } from "../components/NavigationControls";

const mockChallenge = {
  id: "1",
  title: "SOC Incident Response",
  type: "soc",
  scenario:
    "You are the SOC analyst on duty. A SIEM alert fires indicating multiple failed login attempts from an external IP address targeting the executive team's email accounts. The activity started 20 minutes ago and has escalated to 47 failed attempts across 12 accounts.",
  questions: [
    {
      id: "q1",
      text: "Walk me through your initial triage steps. What would you check first and why?",
      type: "open_ended" as const,
    },
    {
      id: "q2",
      text: "How would you determine if this is a brute force attack vs. a credential stuffing attack?",
      type: "open_ended" as const,
    },
  ],
};

export default function AssessmentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  const question = mockChallenge.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / mockChallenge.questions.length) * 100;

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <CheckCircle className="mb-4 h-16 w-16 text-cyber-400" />
        <h2 className="mb-2 text-2xl font-bold text-surface-100">Assessment Complete</h2>
        <p className="mb-6 text-surface-400">Your responses are being evaluated</p>
        <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/assessment")}
          className="flex items-center gap-2 text-sm text-surface-400 hover:text-surface-200"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="text-lg font-semibold text-surface-100">{mockChallenge.title}</h1>
        <Timer />
      </div>

      <ProgressTracker
        current={currentQuestionIndex + 1}
        total={mockChallenge.questions.length}
      />

      <Card variant="elevated">
        <CardContent>
          <div className="mb-4 rounded-lg bg-surface-800/50 p-4">
            <p className="mb-1 text-xs font-medium text-surface-500">SCENARIO</p>
            <p className="text-sm text-surface-300">{mockChallenge.scenario}</p>
          </div>
          <QuestionCard question={question} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <VoiceRecorder onTranscript={setTranscript} />
        <TranscriptPanel transcript={transcript} />
      </div>

      <NavigationControls
        onPrevious={() => setCurrentQuestionIndex((i) => Math.max(0, i - 1))}
        onNext={() => {
          if (currentQuestionIndex < mockChallenge.questions.length - 1) {
            setCurrentQuestionIndex((i) => i + 1);
          } else {
            setIsComplete(true);
          }
        }}
        hasPrevious={currentQuestionIndex > 0}
        hasNext={true}
        isLast={currentQuestionIndex === mockChallenge.questions.length - 1}
      />
    </div>
  );
}
