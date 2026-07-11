import { apiClient } from "@/lib/api-client";
import type { SkillDNAProfile } from "@/types";

export const skillDnaService = {
  async generate(roleDefinitionId: string): Promise<SkillDNAProfile> {
    const response = await apiClient.post<SkillDNAProfile>("/skill-dna", {
      role_definition_id: roleDefinitionId,
    });
    return response.data;
  },

  async get(profileId: string): Promise<SkillDNAProfile> {
    const response = await apiClient.get<SkillDNAProfile>(`/skill-dna/${profileId}`);
    return response.data;
  },

  async listVersions(profileId: string): Promise<SkillDNAProfile[]> {
    const response = await apiClient.get<SkillDNAProfile[]>(
      `/skill-dna/${profileId}/versions`,
    );
    return response.data;
  },

  async list(): Promise<SkillDNAProfile[]> {
    const response = await apiClient.get<SkillDNAProfile[]>("/skill-dna");
    return response.data;
  },
};
