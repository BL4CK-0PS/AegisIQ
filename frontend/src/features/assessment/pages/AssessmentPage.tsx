import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ClipboardCheck, ArrowLeft, AlertTriangle, Send, CheckCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Alert } from "@/components/ui/Alert";
import { assessmentService } from "@/services/assessment.service";

export default function AssessmentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [answer, setAnswer] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

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
    onSuccess: () => {
      setAnswer("");
      setSubmitError(null);
      queryClient.invalidateQueries({ queryKey: ["assessment", id] });
    },
    onError: (err: any) => {
      setSubmitError(err?.response?.data?.detail ?? "Failed to submit answer");
    },
  });

  const evaluateMutation = useMutation({
    mutationFn: () => assessmentService.evaluate(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessment", id] });
      navigate(`/report/${id}`);
    },
    onError: (err: any) => {
      setSubmitError(err?.response?.data?.detail ?? "Failed to evaluate assessment");
    },
  });

  const completeMutation = useMutation({
    mutationFn: () => assessmentService.complete(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessment", id] });
      navigate(`/report/${id}`);
    },
    onError: (err: any) => {
      setSubmitError(err?.response?.data?.detail ?? "Failed to complete assessment");
    },
  });

  if (!id) {
    return (
      <EmptyState
        icon={<ClipboardCheck className="h-8 w-8" />}
        title="No assessment selected"
        description="Navigate to an assessment to view its details"
      />
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
  const questionCount = assessment.question_count ?? 0;
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

  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
            <p className="mt-1 text-sm font-medium text-surface-200">{difficulty}</p>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="py-4">
            <p className="text-xs text-surface-500">Questions Answered</p>
            <p className="mt-1 text-sm font-medium text-surface-200">{questionCount}</p>
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
              <CardTitle>Answer Scenario Question</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-surface-300">
                You are responding to a <span className="font-medium text-primary-400">{domain}</span> scenario
                at <span className="font-medium text-primary-400">{difficulty}</span> difficulty.
                Record your analysis, response steps, or reasoning below.
              </p>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Describe your analysis, response steps, and reasoning..."
                rows={5}
                className="w-full rounded-lg border border-surface-600 bg-surface-800 px-3 py-2 text-sm text-surface-100 placeholder:text-surface-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
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

          {questionCount > 0 && (
            <Card variant="elevated">
              <CardContent className="py-4">
                <p className="text-sm text-surface-400 mb-3">
                  You have submitted {questionCount} response{questionCount !== 1 ? "s" : ""}.
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => evaluateMutation.mutate()}
                    isLoading={evaluateMutation.isPending}
                    leftIcon={<CheckCircle size={16} />}
                  >
                    Evaluate & View Report
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => completeMutation.mutate()}
                    isLoading={completeMutation.isPending}
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
}
