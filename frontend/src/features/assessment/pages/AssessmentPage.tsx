import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ClipboardCheck, ArrowLeft, AlertTriangle, Send, CheckCircle, Target } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Alert } from "@/components/ui/Alert";
import { assessmentService } from "@/services/assessment.service";
import { useProctoring } from "../hooks/useProctoring";
import { ProctoringGuard } from "../components/ProctoringGuard";
import { ProctorStatusBadge } from "../components/ProctorStatusBadge";
import { FullscreenWarningModal } from "../components/FullscreenWarningModal";
import { VoiceInput } from "../components/VoiceInput";

interface ApiError {
  response?: { data?: { detail?: string } };
}

function getErrorMessage(err: unknown, fallback: string): string {
  return (err as ApiError)?.response?.data?.detail ?? fallback;
}

export default function AssessmentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [answer, setAnswer] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [proctoringReady, setProctoringReady] = useState(false);
  const [liveQuestionCount, setLiveQuestionCount] = useState<number | null>(null);
  const [liveNextDifficulty, setLiveNextDifficulty] = useState<string | null>(null);

  const proctoring = useProctoring(id ?? "");

  const {
    data: assessment,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["assessment", id],
    queryFn: () => assessmentService.get(id!),
    enabled: !!id,
  });

  const recordMutation = useMutation({
    mutationFn: (data: {
      assessment_id: string;
      question_id: string;
      question_text: string;
      domain: string;
      skill: string;
      difficulty: string;
      candidate_answer: string;
    }) => assessmentService.recordAnswer(data),
    onSuccess: (response) => {
      setAnswer("");
      setSubmitError(null);
      setLiveQuestionCount(response.question_count);
      setLiveNextDifficulty(response.next_difficulty);
      queryClient.invalidateQueries({ queryKey: ["assessment", id] });
    },
    onError: (err: unknown) => {
      setSubmitError(getErrorMessage(err, "Failed to submit answer"));
    },
  });

  const evaluateMutation = useMutation({
    mutationFn: async () => {
      const summary = proctoring.getProctoringSummary();
      await assessmentService.complete(id!, summary);
      return assessmentService.evaluate(id!);
    },
    onSuccess: () => {
      proctoring.stopMic();
      queryClient.invalidateQueries({ queryKey: ["assessment", id] });
      navigate(`/report/${id}`);
    },
    onError: (err: unknown) => {
      setSubmitError(getErrorMessage(err, "Failed to evaluate assessment"));
    },
  });

  const completeMutation = useMutation({
    mutationFn: () => {
      const summary = proctoring.getProctoringSummary();
      return assessmentService.complete(id!, summary);
    },
    onSuccess: () => {
      proctoring.stopMic();
      queryClient.invalidateQueries({ queryKey: ["assessment", id] });
      navigate(`/report/${id}`);
    },
    onError: (err: unknown) => {
      setSubmitError(getErrorMessage(err, "Failed to complete assessment"));
    },
  });

  if (!id) {
    return (
      <div className="space-y-6">
        <EmptyState
          icon={<ClipboardCheck className="h-8 w-8" />}
          title="No assessment selected"
          description="Navigate to an assessment to view its details"
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-sm text-surface-500">Loading assessment...</div>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <EmptyState
        icon={<AlertTriangle className="h-8 w-8" />}
        title="Assessment not found"
        description="This assessment may have been removed"
        action={{
          label: "Back to Assessments",
          onClick: () => navigate("/assessment"),
        }}
      />
    );
  }

  const status = assessment.status ?? "unknown";
  const domain = assessment.domain ?? "Assessment";
  const difficulty = assessment.current_difficulty ?? "Unknown";
  const effectiveQuestionCount = liveQuestionCount ?? (assessment.question_count ?? 0);
  const currentDifficulty = liveNextDifficulty ?? difficulty;
  const startedAt = assessment.started_at;
  const completedAt = assessment.completed_at;
  const assessmentId = assessment.id ?? id;

  const isCompleted = status === "completed";
  const isActive = status === "active" || status === "in_progress";

  const handleSubmitAnswer = () => {
    if (!answer.trim()) return;
    recordMutation.mutate({
      assessment_id: assessmentId,
      question_id: `q-${Date.now()}`,
      question_text: `Scenario question for ${domain} (${difficulty})`,
      domain,
      skill: domain,
      difficulty,
      candidate_answer: answer.trim(),
    });
  };

  const handleVoiceTranscript = (text: string) => {
    setAnswer((prev) => (prev ? prev + " " + text : text));
  };

  const innerContent = (
    <div className="space-y-6" data-proctoring-zone>
      <FullscreenWarningModal
        isOpen={!proctoring.isFullscreen && proctoringReady && isActive}
        onReenterFullscreen={proctoring.enterFullscreen}
        violationCount={proctoring.violationCount}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/assessment")}>
            <ArrowLeft size={16} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-surface-100">{domain}</h1>
            <p className="text-sm text-surface-400">
              ID: {assessmentId.slice(0, 8)}...
            </p>
          </div>
        </div>
        {isActive && (
          <ProctorStatusBadge
            isFullscreen={proctoring.isFullscreen}
            isScreenSharing={proctoring.isScreenSharing}
            isMicActive={proctoring.isMicActive}
            isTabFocused={proctoring.isTabFocused}
            violationCount={proctoring.violationCount}
            isLocked={proctoring.isLocked}
            audioLevel={proctoring.audioLevel}
          />
        )}
      </div>

      {proctoring.violationCount > 0 && !proctoring.isLocked && (
        <Alert variant="warning" title="Proctoring Warning">
          {proctoring.violationCount}/{3} violations recorded. Maintain fullscreen and stay focused to avoid automatic submission.
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card variant="elevated">
          <CardContent className="py-4">
            <p className="text-xs text-surface-500">Status</p>
            <p className={`mt-1 text-sm font-medium ${
              isCompleted ? "text-success-400" : isActive ? "text-primary-400" : "text-surface-400"
            }`}>
              {status}
            </p>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="py-4">
            <p className="text-xs text-surface-500">Difficulty</p>
            <p className="mt-1 text-sm font-medium text-surface-200">{currentDifficulty}</p>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="py-4">
            <p className="text-xs text-surface-500">Questions Answered</p>
            <p className="mt-1 text-sm font-medium text-surface-200">
              {effectiveQuestionCount}
              {!isCompleted && (
                <span className="ml-1 text-xs text-surface-500">/ 5 min</span>
              )}
            </p>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="py-4">
            <p className="text-xs text-surface-500">Progress</p>
            <div className="mt-2">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-700">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    effectiveQuestionCount >= 5 ? "bg-success-500" : "bg-primary-500"
                  }`}
                  style={{ width: `${Math.min((effectiveQuestionCount / 5) * 100, 100)}%` }}
                />
              </div>
              <p className="mt-1 text-[11px] text-surface-500">
                {effectiveQuestionCount >= 5
                  ? "Ready to evaluate"
                  : `${Math.max(0, 5 - effectiveQuestionCount)} more needed`}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {startedAt && (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-surface-400">Started</span>
              <span className="text-surface-200">
                {new Date(startedAt).toLocaleString()}
              </span>
            </div>
            {completedAt && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-surface-400">Completed</span>
                <span className="text-surface-200">
                  {new Date(completedAt).toLocaleString()}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {isCompleted && (
        <Card variant="elevated">
          <CardContent className="py-4">
            <Button onClick={() => navigate(`/report/${assessmentId}`)}>
              View Report
            </Button>
          </CardContent>
        </Card>
      )}

      {isActive && (
        <>
          {submitError && (
            <Alert variant="error">{submitError}</Alert>
          )}

          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target size={16} className="text-primary-400" />
                Answer Scenario Question
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-surface-300">
                You are responding to a <span className="font-medium text-primary-400">{domain}</span> scenario
                at <span className="font-medium text-primary-400">{currentDifficulty}</span> difficulty.
                Record your analysis, response steps, or reasoning below.
              </p>
              {liveNextDifficulty && liveNextDifficulty !== difficulty && (
                <p className="text-xs text-cyber-400">
                  Adaptive engine adjusted difficulty to {liveNextDifficulty} based on your recent answers.
                </p>
              )}
              <div className="space-y-2">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Describe your analysis, response steps, and reasoning..."
                  rows={5}
                  className="w-full rounded-lg border border-surface-600 bg-surface-800 px-3 py-2 text-sm text-surface-100 placeholder:text-surface-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <div className="flex items-center gap-2">
                  <VoiceInput
                    onTranscript={handleVoiceTranscript}
                    disabled={recordMutation.isPending}
                  />
                  <span className="text-[11px] text-surface-500">
                    {recordMutation.isPending ? "Dictation unavailable" : "Voice dictation (English)"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleSubmitAnswer}
                  isLoading={recordMutation.isPending}
                  disabled={!answer.trim()}
                  leftIcon={<Send size={16} />}
                >
                  Submit Answer
                </Button>
              </div>
            </CardContent>
          </Card>

          {effectiveQuestionCount > 0 && (
            <Card variant="elevated">
              <CardContent className="py-4">
                <p className="text-sm text-surface-400 mb-3">
                  You have submitted {effectiveQuestionCount} response{effectiveQuestionCount !== 1 ? "s" : ""}.
                  {effectiveQuestionCount < 5 && (
                    <span className="ml-1 text-warning-400">
                      Answer at least {5 - effectiveQuestionCount} more to unlock evaluation.
                    </span>
                  )}
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => evaluateMutation.mutate()}
                    isLoading={evaluateMutation.isPending}
                    disabled={effectiveQuestionCount < 5}
                    leftIcon={<CheckCircle size={16} />}
                  >
                    {effectiveQuestionCount < 5 ? "Minimum 5 Questions Required" : "Evaluate & View Report"}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => completeMutation.mutate()}
                    isLoading={completeMutation.isPending}
                    disabled={effectiveQuestionCount < 5}
                  >
                    Complete Without Evaluation
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );

  if (!proctoringReady && isActive) {
    return (
      <ProctoringGuard
        proctoring={proctoring}
        onReady={() => setProctoringReady(true)}
      >
        {innerContent}
      </ProctoringGuard>
    );
  }

  return innerContent;
}
