import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assessmentService, type RecordAnswerResponse, type EvaluateResponse } from "@/services/assessment.service";

export function useAssessment(assessmentId?: string) {
  const queryClient = useQueryClient();

  const { data: assessment, isLoading } = useQuery({
    queryKey: ["assessment", assessmentId],
    queryFn: () => assessmentService.get(assessmentId!),
    enabled: !!assessmentId,
  });

  const createMutation = useMutation({
    mutationFn: ({ domain, difficulty }: { domain: string; difficulty?: string }) =>
      assessmentService.create(domain, difficulty),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
    },
  });

  const recordAnswerMutation = useMutation({
    mutationFn: (data: {
      assessment_id: string;
      question_id: string;
      question_text: string;
      domain: string;
      skill: string;
      difficulty: string;
      candidate_answer: string;
    }) => assessmentService.recordAnswer(data),
  });

  const evaluateMutation = useMutation({
    mutationFn: (assessId: string) => assessmentService.evaluate(assessId),
    onSuccess: (_data, assessId) => {
      queryClient.invalidateQueries({ queryKey: ["assessment", assessId] });
    },
  });

  const completeMutation = useMutation({
    mutationFn: ({ id, proctoringSummary }: { id: string; proctoringSummary?: Parameters<typeof assessmentService.complete>[1] }) =>
      assessmentService.complete(id, proctoringSummary),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
    },
  });

  const getResults = useCallback(
    (id: string) => assessmentService.getResults(id),
    [],
  );

  return {
    assessment,
    isLoading,
    create: createMutation.mutate,
    recordAnswer: recordAnswerMutation.mutate,
    evaluate: evaluateMutation.mutate,
    complete: completeMutation.mutate,
    getResults,
    isCreating: createMutation.isPending,
    isRecording: recordAnswerMutation.isPending,
    isEvaluating: evaluateMutation.isPending,
    isCompleting: completeMutation.isPending,
    lastRecordResult: recordAnswerMutation.data as RecordAnswerResponse | undefined,
    lastEvaluateResult: evaluateMutation.data as EvaluateResponse | undefined,
  };
}
