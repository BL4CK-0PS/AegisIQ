import { apiClient } from "@/lib/api-client";

export interface CareerCompassAnalysis {
  status: string;
  target_role: string;
  overall_match_percentage: number;
  domain_results: Record<string, unknown>[];
  critical_gaps: Record<string, unknown>[];
  progression_steps: string[];
}

export interface CareerCompassRoles {
  status: string;
  roles: Record<string, unknown>[];
}

export const learningService = {
  async analyzeCareerCompass(targetRole: string): Promise<CareerCompassAnalysis> {
    const response = await apiClient.post<CareerCompassAnalysis>("/career-compass/analyze", {
      target_role: targetRole,
    });
    return response.data;
  },

  async getBestFitRoles(): Promise<CareerCompassRoles> {
    const response = await apiClient.get<CareerCompassRoles>("/career-compass/roles");
    return response.data;
  },
};
