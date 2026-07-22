import { apiClient } from "@/lib/api-client";

export interface ParsedCapability {
  name: string;
  weight: number;
}

export interface SkillDNAParseResult {
  status: string;
  profile_id: string;
  title: string;
  difficulty: string;
  capabilities: { id: string; name: string; category: string; weight: number; difficulty: string; description: string; sub_skills: string[] }[];
  knowledge_areas: { id: string; name: string; domain: string; importance: string; description: string }[];
  responsibilities: string[];
  assessment_objectives: string[];
  estimated_duration_minutes: number;
  recommended_rubric: string;
  mitre_technique_ids: string[];
}

export const roleDefinitionService = {
  async parseText(jdText: string, title = "Job Description"): Promise<SkillDNAParseResult> {
    const response = await apiClient.post<SkillDNAParseResult>("/jd/parse", {
      jd_text: jdText,
      title,
    });
    return response.data;
  },

  async upload(file: File): Promise<SkillDNAParseResult> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<SkillDNAParseResult>("/role-definitions", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async parse(roleDefinitionId: string): Promise<SkillDNAParseResult> {
    const response = await apiClient.post<SkillDNAParseResult>(
      `/role-definitions/${roleDefinitionId}/parse`,
    );
    return response.data;
  },

  async get(roleDefinitionId: string): Promise<SkillDNAParseResult> {
    const response = await apiClient.get<SkillDNAParseResult>(
      `/role-definitions/${roleDefinitionId}`,
    );
    return response.data;
  },
};
