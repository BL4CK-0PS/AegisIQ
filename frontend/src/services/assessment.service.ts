import { apiClient } from "@/lib/api-client";

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

export interface RecordAnswerResponse {
  status: string;
  record_id: string;
  question_text: string;
}

export interface EvaluateResponse {
  status: string;
  assessment_id: string;
  evaluations_count: number;
  average_score: number;
  evaluations: {
    id: string;
    score: number;
    confidence: number;
    proficiency_level: string;
    passed: boolean;
    mitre_technique_ids: string[];
  }[];
}

export interface CompleteResponse {
  status: string;
  assessment_id: string;
  summary: Record<string, unknown>;
}

export interface ResultsResponse {
  assessment_id: string;
  evaluation_count: number;
  results: {
    id: string;
    overall_score: number;
    penalized_score?: number;
    confidence: number;
    proficiency_level: string;
    passed: boolean;
    criteria_scores: { criterion_name: string; score: number; max_score: number; justification: string; passed: boolean }[];
    missing_concepts: string[];
    demonstrated_skills: string[];
    mitre_technique_ids: string[];
    overall_justification: string;
  }[];
  proctoring_summary?: ProctoringSummary;
}

export interface ProctoringViolation {
  type: "tab_switch" | "fullscreen_exit" | "screen_share_stopped" | "clipboard_attempt" | "context_menu" | "audio_anomaly";
  timestamp: number;
  detail: string;
}

export interface ProctoringSummary {
  assessment_id: string;
  violation_count: number;
  violations: ProctoringViolation[];
  integrity_score: number;
  cheating_risk_flagged: boolean;
  tab_switches: number;
  fullscreen_exits: number;
  screen_share_stops: number;
  audio_anomalies: number;
  clipboard_attempts?: number;
  context_menu_blocks?: number;
  voice_enabled?: boolean;
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

  async recordAnswer(data: {
    assessment_id: string;
    question_id: string;
    question_text: string;
    domain: string;
    skill: string;
    difficulty: string;
    candidate_answer: string;
  }): Promise<RecordAnswerResponse> {
    const response = await apiClient.post<RecordAnswerResponse>("/assessments/record", data);
    return response.data;
  },

  async evaluate(assessmentId: string): Promise<EvaluateResponse> {
    const response = await apiClient.post<EvaluateResponse>(
      `/assessments/${assessmentId}/evaluate`,
    );
    return response.data;
  },

  async complete(assessmentId: string, proctoringSummary?: ProctoringSummary): Promise<CompleteResponse> {
    const response = await apiClient.post<CompleteResponse>(
      `/assessments/${assessmentId}/complete`,
      { assessment_id: assessmentId, proctoring_summary: proctoringSummary ?? null },
    );
    return response.data;
  },

  async getResults(assessmentId: string): Promise<ResultsResponse> {
    const response = await apiClient.get<ResultsResponse>(
      `/assessments/${assessmentId}/results`,
    );
    return response.data;
  },
};
