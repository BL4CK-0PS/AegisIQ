export interface SkillDNAProfile {
  id: string;
  version: number;
  title: string;
  role_definition_id: string;
  capabilities: Capability[];
  knowledge_areas: KnowledgeArea[];
  responsibilities: Responsibility[];
  assessment_objectives: string[];
  created_at: string;
}

export interface Capability {
  id: string;
  name: string;
  category: string;
  weight: number;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  description: string;
  sub_skills: string[];
}

export interface KnowledgeArea {
  id: string;
  name: string;
  domain: string;
  importance: "critical" | "high" | "medium" | "low";
  description: string;
}

export interface Responsibility {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}
