import axios from 'axios';

const BACKEND_URL = 'http://127.0.0.1:8000';

export const sendVoiceTranscript = async (topic: string, difficulty: string) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/ai/generate`, {
      topic,
      difficulty,
    });
    return response.data;
  } catch (error) {
    console.error('Backend integration failed:', error);
    throw error;
  }
};