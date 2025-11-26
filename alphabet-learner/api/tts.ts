import { GoogleGenAI, Modality } from "@google/genai";

// This file runs in a Node.js environment on Vercel (Serverless Function)
// It is secure to use process.env.API_KEY here.

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Server configuration error: API_KEY missing' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { text, voice } = await req.json();

    if (!text) {
      return new Response(JSON.stringify({ error: 'Text is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say this letter clearly and friendly: "${text}"` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || 'Puck' },
          },
        },
      },
    });

    const candidate = response.candidates?.[0];
    const audioPart = candidate?.content?.parts?.find(p => p.inlineData);
    
    const result = {
      audioData: audioPart?.inlineData?.data,
      text: candidate?.content?.parts?.find(p => p.text)?.text
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const config = {
  runtime: 'edge', // Use Vercel Edge Runtime for faster cold starts
};