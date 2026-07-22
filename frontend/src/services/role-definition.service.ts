import { apiClient } from "@/lib/api-client";
import type { RoleDefinition } from "@/types";

interface ParsedCapability {
  name: string;
  weight: number;
}

export interface ParsedRoleDefinition {
  role: string;
  skills: string[];
  capabilities: ParsedCapability[];
  experience: string;
  certifications: string[];
}

export const roleDefinitionService = {
  async upload(file: File): Promise<RoleDefinition> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<RoleDefinition>("/role-definitions", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async parse(roleDefinitionId: string): Promise<ParsedRoleDefinition> {
    const response = await apiClient.post<ParsedRoleDefinition>(
      `/role-definitions/${roleDefinitionId}/parse`,
    );
    return response.data;
  },

  async get(roleDefinitionId: string): Promise<RoleDefinition> {
    const response = await apiClient.get<RoleDefinition>(
      `/role-definitions/${roleDefinitionId}`,
    );
    return response.data;
  },
};
