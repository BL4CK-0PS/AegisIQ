import { useState, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assessmentService } from "@/services/assessment.service";
import type { Challenge, Response, Evaluation } from "@/types";

interface AssessmentState {
  assessmentId: string | null;
  currentChallenge: Challenge | null;
  responses: Response[];
  evaluations: Evaluation[];
  isComplete: boolean;
}

export function useAssessment(assessmentId?: string) {
  const queryClient = useQueryClient();
  const [state, setState] = useState<AssessmentState>({
    assessmentId: assessmentId || null,
    currentChallenge: null,
    responses: [],
    evaluations: [],
    isComplete: false,
  });

  const { data: assessment, isLoading } = useQuery({
    queryKey: ["assessment", assessmentId],
    queryFn: () => assessmentService.get(assessmentId!),
    enabled: !!assessmentId,
  });

  const startMutation = useMutation({
    mutationFn: (id: string) => assessmentService.start(id),
    onSuccess: (data) => {
      setState((prev) => ({ ...prev, assessmentId: data.id }));
      queryClient.invalidateQueries({ queryKey: ["assessment"] });
    },
  });

  const nextChallengeMutation = useMutation({
    mutationFn: (id: string) => assessmentService.getNextChallenge(id),
    onSuccess: (challenge) => {
      setState((prev) => ({ ...prev, currentChallenge: challenge }));
    },
  });

  const submitResponseMutation = useMutation({
    mutationFn: ({
      challengeId,
      data,
    }: {
      challengeId: string;
      data: { response_type: "voice" | "text"; transcript: string };
    }) => assessmentService.submitResponse(challengeId, data),
    onSuccess: (response) => {
      setState((prev) => ({
        ...prev,
        responses: [...prev.responses, response],
      }));
    },
  });

  const getEvaluationMutation = useMutation({
    mutationFn: (responseId: string) => assessmentService.getEvaluation(responseId),
    onSuccess: (evaluation) => {
      setState((prev) => ({
        ...prev,
        evaluations: [...prev.evaluations, evaluation],
      }));
    },
  });

  const completeMutation = useMutation({
    mutationFn: (id: string) => assessmentService.complete(id),
    onSuccess: () => {
      setState((prev) => ({ ...prev, isComplete: true }));
      queryClient.invalidateQueries({ queryKey: ["assessment"] });
    },
  });

  const loadNextChallenge = useCallback(() => {
    if (state.assessmentId) {
      nextChallengeMutation.mutate(state.assessmentId);
    }
  }, [state.assessmentId, nextChallengeMutation]);

  return {
    assessment,
    isLoading,
    ...state,
    start: startMutation.mutate,
    loadNextChallenge,
    submitResponse: submitResponseMutation.mutate,
    getEvaluation: getEvaluationMutation.mutate,
    complete: completeMutation.mutate,
    isStarting: startMutation.isPending,
    isSubmitting: submitResponseMutation.isPending,
    isCompleting: completeMutation.isPending,
  };
}
