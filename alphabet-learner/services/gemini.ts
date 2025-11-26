import { VoiceName } from "../types";

export interface SpeechResponse {
  audioData: string | undefined; // Base64 string
  text: string | undefined;
}

/**
 * Calls the Vercel Serverless Function to generate speech.
 * This keeps the API KEY hidden on the server side.
 */
export async function generateLetterSpeech(
  text: string, 
  voice: VoiceName = 'Puck'
): Promise<SpeechResponse> {
  
  try {
    // We now call our own internal API endpoint instead of Google directly
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, voice }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate speech');
    }

    const data = await response.json();
    
    return {
      audioData: data.audioData,
      text: data.text
    };

  } catch (error) {
    console.error("TTS Service Error:", error);
    throw error;
  }
}