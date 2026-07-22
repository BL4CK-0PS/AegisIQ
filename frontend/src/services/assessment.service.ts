import { apiClient } from "@/lib/api-client";
import type { Assessment, Challenge, Response, Evaluation } from "@/types";

export interface SubmitResponseRequest {
  response_type: "voice" | "text";
  transcript: string;
}

export const assessmentService = {
  async list(): Promise<Assessment[]> {
    const response = await apiClient.get<Assessment[]>("/capability-assessments");
    return response.data;
  },

  async create(skillDnaProfileId: string): Promise<Assessment> {
    const response = await apiClient.post<Assessment>("/capability-assessments", {
      skill_dna_profile_id: skillDnaProfileId,
    });
    return response.data;
  },

  async start(assessmentId: string): Promise<Assessment> {
    const response = await apiClient.post<Assessment>(
      `/capability-assessments/${assessmentId}/start`,
    );
    return response.data;
  },

  async get(assessmentId: string): Promise<Assessment> {
    const response = await apiClient.get<Assessment>(
      `/capability-assessments/${assessmentId}`,
    );
    return response.data;
  },

  async resume(assessmentId: string): Promise<Assessment> {
    const response = await apiClient.post<Assessment>(
      `/capability-assessments/${assessmentId}/resume`,
    );
    return response.data;
  },

  async complete(assessmentId: string): Promise<Assessment> {
    const response = await apiClient.post<Assessment>(
      `/capability-assessments/${assessmentId}/complete`,
    );
    return response.data;
  },

  async getNextChallenge(assessmentId: string): Promise<Challenge> {
    const response = await apiClient.get<Challenge>(
      `/capability-assessments/${assessmentId}/challenges/next`,
    );
    return response.data;
  },

  async submitResponse(
    challengeId: string,
    data: SubmitResponseRequest,
  ): Promise<Response> {
    const response = await apiClient.post<Response>(
      `/challenges/${challengeId}/responses`,
      data,
    );
    return response.data;
  },

  async getEvaluation(responseId: string): Promise<Evaluation> {
    const response = await apiClient.get<Evaluation>(`/evaluations/${responseId}`);
    return response.data;
  },
};
