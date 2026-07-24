import { apiClient } from "@/lib/api-client";

interface VoiceTranscriptResponse {
  source: string;
  data: unknown;
}

export const sendVoiceTranscript = async (
  topic: string,
  difficulty: string,
): Promise<VoiceTranscriptResponse> => {
  const response = await apiClient.post<VoiceTranscriptResponse>("/ai/generate-assessment", {
    topic,
    difficulty,
  });
  return response.data;
};
