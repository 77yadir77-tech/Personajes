import { GoogleGenAI, Modality } from "@google/genai";
import { decodeBase64, pcmToWav } from "./audioUtils";

const apiKey = process.env.API_KEY || '';

// We reuse the client instance
const ai = new GoogleGenAI({ apiKey });

export const generateSpeech = async (text: string, voiceName: string = 'Kore', temperature: number = 1.0): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  try {
    // We wrap the text with a forceful instruction to guide the accent.
    // Using English for the instruction helps separate it from the Spanish content,
    // ensuring the model treats it as a directive and doesn't read it aloud.
    const promptWithDirection = `Please read the following text with a standard Neutral Latin American Spanish accent (Español Neutro). It is crucial to avoid Rioplatense (Argentine/Uruguayan) intonation or "sheísmo" (sh sound for ll/y). Speak clearly and warmly. The text is: "${text}"`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [
        {
          parts: [
            { text: promptWithDirection }
          ]
        }
      ],
      config: {
        // Temperature controls the randomness/expressivity of the output (0.0 - 2.0)
        // API Limit is strict: [0.0, 2.0]
        temperature: temperature,
        // System instructions are not supported for the TTS-only model and cause 500 errors.
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { 
              voiceName: voiceName
            },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      throw new Error("No audio data returned from Gemini.");
    }

    // Decode and convert to WAV blob for easy playback in browser
    const pcmData = decodeBase64(base64Audio);
    
    // Gemini 2.5 Flash TTS typically outputs 24kHz
    const wavBlob = pcmToWav(pcmData, 24000);
    
    return URL.createObjectURL(wavBlob);

  } catch (error) {
    console.error("Gemini TTS Error:", error);
    throw error;
  }
};