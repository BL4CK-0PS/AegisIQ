import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Loader2,
  Mic,
  Type,
  AlertTriangle,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { EmptyState } from "@/components/feedback/EmptyState";
import { useAssessment } from "@/hooks/use-assessment";
import { assessmentService } from "@/services/assessment.service";

const responseSchema = z.object({
  transcript: z
    .string()
    .min(1, "Response cannot be empty")
    .max(10000, "Response must be under 10,000 characters"),
});

type ResponseForm = z.infer<typeof responseSchema>;

export default function AssessmentPage() {
  const { id: assessmentId } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResponseForm>({
    resolver: zodResolver(responseSchema),
  });

  const {
    assessment,
    isLoading: assessmentLoading,
    currentChallenge,
    loadNextChallenge,
    submitResponse,
    complete,
    isSubmitting,
  } = useAssessment(assessmentId);

  useEffect(() => {
    if (assessment?.status === "in_progress" && !currentChallenge) {
      loadNextChallenge();
    }
  }, [assessment, currentChallenge, loadNextChallenge]);

  if (assessmentLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
          <p className="text-sm text-surface-400">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <EmptyState
        icon={<AlertTriangle className="h-8 w-8" />}
        title="Assessment not found"
        description="This assessment may not exist or you may not have access to it."
        action={{
          label: "Back to Assessments",
          onClick: () => navigate("/assessment"),
        }}
      />
    );
  }

  if (assessment.status === "completed") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-surface-100">Assessment Complete</h1>
            <p className="text-sm text-surface-400">Your results are being processed</p>
          </div>
        </div>

        <Card variant="elevated" className="flex flex-col items-center p-12 text-center">
          <CheckCircle className="mb-4 h-16 w-16 text-cyber-400" />
          <h2 className="mb-2 text-xl font-semibold text-surface-100">Well Done!</h2>
          <p className="mb-6 max-w-md text-surface-400">
            You have completed all {assessment.total_challenges} challenges.
            Your report will be available shortly.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Dashboard
            </Button>
            <Button onClick={() => navigate(`/report/${assessment.id}`)}>
              View Report
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (assessment.status === "pending") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-surface-100">Start Assessment</h1>
            <p className="text-sm text-surface-400">
              {assessment.total_challenges} challenges await you
            </p>
          </div>
        </div>

        <Card variant="elevated" className="flex flex-col items-center p-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-900/30">
            <ArrowRight className="h-8 w-8 text-primary-400" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-surface-100">Ready to Begin?</h2>
          <p className="mb-6 max-w-md text-surface-400">
            This assessment will evaluate your cybersecurity capabilities across
            {assessment.total_challenges} adaptive challenges. Take your time and answer thoroughly.
          </p>
          <Button
            onClick={() => assessmentService.start(assessment.id)}
            size="lg"
          >
            Start Assessment
          </Button>
        </Card>
      </div>
    );
  }

  const progress = assessment.total_challenges > 0
    ? ((assessment.current_challenge_index) / assessment.total_challenges) * 100
    : 0;

  const onSubmit = (data: ResponseForm) => {
    if (!currentChallenge) return;
    submitResponse(
      {
        challengeId: currentChallenge.id,
        data: {
          response_type: "text",
          transcript: data.transcript.trim(),
        },
      },
      {
        onSuccess: () => {
          reset();
          if (assessment.current_challenge_index + 1 >= assessment.total_challenges) {
            complete(assessment.id);
          } else {
            loadNextChallenge();
          }
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-surface-100">
              Challenge {assessment.current_challenge_index + 1} of {assessment.total_challenges}
            </h1>
            <p className="text-sm text-surface-400">
              {currentChallenge?.type.toUpperCase().replace("_", " ")} Mission
            </p>
          </div>
        </div>
        <Badge variant="primary" size="sm">
          {Math.round(progress)}% Complete
        </Badge>
      </div>

      <Progress value={progress} size="sm" />

      {currentChallenge ? (
        <div className="space-y-6">
          <Card variant="elevated" className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Badge variant="primary" size="sm">{currentChallenge.type}</Badge>
              {currentChallenge.status === "active" && (
                <Badge variant="success" size="sm">Active</Badge>
              )}
            </div>
            <h2 className="mb-2 text-lg font-semibold text-surface-100">
              {currentChallenge.title}
            </h2>
            <p className="leading-relaxed text-surface-300">
              {currentChallenge.scenario}
            </p>
          </Card>

          {currentChallenge.questions.length > 0 && (
            <Card variant="elevated" className="p-6">
              <h3 className="mb-4 text-sm font-medium text-surface-300">Question</h3>
              <p className="mb-4 text-surface-200">
                {currentChallenge.questions[0]?.text}
              </p>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3 flex gap-2">
                  <Button type="button" variant="primary" size="sm" disabled>
                    <Type className="mr-1 h-4 w-4" />
                    Text
                  </Button>
                  <Button type="button" variant="outline" size="sm" disabled>
                    <Mic className="mr-1 h-4 w-4" />
                    Voice
                  </Button>
                </div>

                <textarea
                  {...register("transcript")}
                  placeholder="Type your response here..."
                  rows={6}
                  className="w-full rounded-lg border border-surface-600 bg-surface-800 px-4 py-3 text-surface-200 placeholder-surface-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                {errors.transcript && (
                  <p className="mt-1 text-sm text-danger-400">
                    {errors.transcript.message}
                  </p>
                )}

                <div className="mt-4 flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                    rightIcon={<ArrowRight size={16} />}
                  >
                    Submit Response
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </div>
      ) : (
        <Card variant="elevated" className="flex flex-col items-center p-12 text-center">
          <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary-400" />
          <p className="text-surface-400">Loading next challenge...</p>
        </Card>
      )}
    </div>
  );
}
