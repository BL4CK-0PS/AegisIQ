import { apiClient } from "@/lib/api-client";
import type { Report } from "@/types";

export const reportService = {
  async generate(assessmentId: string): Promise<Report> {
    const response = await apiClient.post<Report>("/reports", {
      assessment_id: assessmentId,
    });
    return response.data;
  },

  async get(reportId: string): Promise<Report> {
    const response = await apiClient.get<Report>(`/reports/${reportId}`);
    return response.data;
  },

  async exportPdf(reportId: string): Promise<Blob> {
    const response = await apiClient.get(`/reports/${reportId}/pdf`, {
      responseType: "blob",
    });
    return response.data;
  },

  async exportJson(reportId: string): Promise<Report> {
    const response = await apiClient.get<Report>(`/reports/${reportId}/json`);
    return response.data;
  },
};
