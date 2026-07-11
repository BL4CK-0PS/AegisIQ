export interface Report {
  id: string;
  assessment_id: string;
  professional_id: string;
  summary: string;
  overall_score: number;
  confidence: number;
  capability_scores: CapabilityScore[];
  evidence: Evidence[];
  recommendations: Recommendation[];
  strengths: string[];
  weaknesses: string[];
  mitre_mapping: string[];
  generated_at: string;
}

export interface CapabilityScore {
  name: string;
  score: number;
  max_score: number;
  confidence: number;
  category: string;
}

export interface Evidence {
  capability: string;
  description: string;
  quality: "strong" | "moderate" | "weak";
  source: string;
}

export interface Recommendation {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category: string;
  resources: Resource[];
}

export interface Resource {
  title: string;
  type: "course" | "lab" | "certification" | "reading";
  url: string;
  estimated_hours: number;
}
