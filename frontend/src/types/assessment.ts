export type AssessmentStatus = "pending" | "in_progress" | "completed" | "paused" | "abandoned";

export type ChallengeType = "soc" | "dfir" | "threat_hunting" | "cloud" | "malware" | "iam";

export type ResponseType = "voice" | "text";

export interface Assessment {
  id: string;
  professional_id: string;
  skill_dna_profile_id: string;
  status: AssessmentStatus;
  started_at: string | null;
  completed_at: string | null;
  current_challenge_index: number;
  total_challenges: number;
  progress: number;
  duration_seconds: number | null;
  challenges: Challenge[];
}

export interface Challenge {
  id: string;
  assessment_id: string;
  type: ChallengeType;
  scenario: string;
  title: string;
  questions: Question[];
  sequence: number;
  status: "pending" | "active" | "completed";
}

export interface Question {
  id: string;
  challenge_id: string;
  text: string;
  type: "open_ended" | "multiple_choice" | "practical";
  follow_up_required: boolean;
}

export interface Response {
  id: string;
  challenge_id: string;
  question_id: string;
  transcript: string;
  response_type: ResponseType;
  submitted_at: string;
}

export interface Evaluation {
  id: string;
  response_id: string;
  score: number;
  confidence: number;
  capabilities: CapabilityEvaluation[];
  evidence: EvidenceItem[];
  mitre_mapping: string[];
  workflow_score: number;
  decision_score: number;
  communication_score: number;
}

export interface CapabilityEvaluation {
  name: string;
  score: number;
  confidence: number;
  evidence: string[];
}

export interface EvidenceItem {
  concept: string;
  covered: boolean;
  quality: "strong" | "moderate" | "weak" | "absent";
  detail: string;
}
