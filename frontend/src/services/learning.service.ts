import { apiClient } from "@/lib/api-client";
import type { CareerCompass } from "@/types";

export const learningService = {
  async generateCompass(assessmentId: string): Promise<CareerCompass> {
    const response = await apiClient.post<CareerCompass>("/career-compass", {
      assessment_id: assessmentId,
    });
    return response.data;
  },

  async getCompass(compassId: string): Promise<CareerCompass> {
    const response = await apiClient.get<CareerCompass>(`/career-compass/${compassId}`);
    return response.data;
  },

  async listCompasses(): Promise<CareerCompass[]> {
    const response = await apiClient.get<CareerCompass[]>("/career-compass");
    return response.data;
  },
};
