export interface CareerCompass {
  id: string;
  assessment_id: string;
  weak_skills: WeakSkill[];
  recommendations: LearningRecommendation[];
  labs: Lab[];
  roadmap: RoadmapItem[];
  suggested_reassessment_date: string;
  generated_at: string;
}

export interface WeakSkill {
  name: string;
  current_level: number;
  target_level: number;
  gap: number;
  priority: "critical" | "high" | "medium" | "low";
}

export interface LearningRecommendation {
  topic: string;
  reason: string;
  resources: LearningResource[];
  estimated_hours: number;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface LearningResource {
  title: string;
  type: "course" | "lab" | "reading" | "video" | "practice";
  url: string;
  provider: string;
}

export interface Lab {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimated_hours: number;
  skills_practiced: string[];
}

export interface RoadmapItem {
  phase: number;
  title: string;
  description: string;
  duration_weeks: number;
  skills_focus: string[];
  milestones: string[];
}
