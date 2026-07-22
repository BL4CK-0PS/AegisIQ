import { apiClient } from "@/lib/api-client";
import type { Assessment, Challenge, Response, Evaluation } from "@/types";

export interface AssessmentListItem {
  id: string;
  domain: string | null;
  status: string;
  current_difficulty: string | null;
  started_at: string | null;
  completed_at: string | null;
  question_count: number;
}

export interface PaginatedAssessments {
  assessments: AssessmentListItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface CreateAssessmentResponse {
  status: string;
  assessment_id: string;
  domain: string;
  difficulty: string;
  state: string;
}

export const assessmentService = {
  async list(limit = 20, offset = 0): Promise<PaginatedAssessments> {
    const response = await apiClient.get<PaginatedAssessments>("/assessments/", {
      params: { limit, offset },
    });
    return response.data;
  },

  async get(assessmentId: string): Promise<Assessment> {
    const response = await apiClient.get<Assessment>(
      `/assessments/${assessmentId}`,
    );
    return response.data;
  },

  async create(domain: string, difficulty = "beginner"): Promise<CreateAssessmentResponse> {
    const response = await apiClient.post<CreateAssessmentResponse>("/assessments/create", {
      domain,
      difficulty,
    });
    return response.data;
  },

  async start(assessmentId: string): Promise<any> {
    const response = await apiClient.post(`/assessments/${assessmentId}/evaluate`);
    return response.data;
  },

  async recordAnswer(data: {
    assessment_id: string;
    question_id: string;
    question_text: string;
    domain: string;
    skill: string;
    difficulty: string;
    candidate_answer: string;
  }): Promise<any> {
    const response = await apiClient.post("/assessments/record", data);
    return response.data;
  },

  async evaluate(assessmentId: string): Promise<any> {
    const response = await apiClient.post(
      `/assessments/${assessmentId}/evaluate`,
    );
    return response.data;
  },

  async complete(assessmentId: string): Promise<any> {
    const response = await apiClient.post(
      `/assessments/${assessmentId}/complete`,
    );
    return response.data;
  },

  async getResults(assessmentId: string): Promise<any> {
    const response = await apiClient.get(
      `/assessments/${assessmentId}/results`,
    );
    return response.data;
  },

  async resume(assessmentId: string): Promise<Assessment> {
    const response = await apiClient.post<Assessment>(
      `/assessments/${assessmentId}/resume`,
    );
    return response.data;
  },

  async getNextChallenge(assessmentId: string): Promise<Challenge> {
    const response = await apiClient.get<Challenge>(
      `/assessments/${assessmentId}/challenges/next`,
    );
    return response.data;
  },

  async submitResponse(
    challengeId: string,
    data: { response_type: "voice" | "text"; transcript: string },
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
