import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Question, QuestionType } from '../types';

let ai: GoogleGenAI | null = null;

try {
  // Only initialize if key is present to avoid crashing in environments without key
  if (process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
} catch (error) {
  console.error("Failed to initialize Gemini Client", error);
}

export const generateHint = async (questionText: string, wrongAnswer: string): Promise<string> => {
  if (!ai) return "Pide a un adulto que te ayude a configurar la llave mágica (API Key).";

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Actúa como "Sparky", un duende matemático mágico, enérgico y amigable para niños.
      El niño está atascado en esta pregunta: "${questionText}".
      El niño respondió incorrectamente: "${wrongAnswer}".
      
      Tu misión: Dar una pista ÚTIL pero SIN dar la respuesta directa.
      Estilo: Breve (máximo 20 palabras), entusiasta, usa emojis de magia (✨, 🧚, ⚡).
      Ejemplo: "¡Casi! Recuerda que sumar es juntar. Prueba contando con los dedos ✨".
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "¡Inténtalo de nuevo! Tú puedes.";
  } catch (error) {
    console.error("Gemini hint error:", error);
    return "¡Sigue intentando! Revisa bien los números.";
  }
};

export const generateChallengeQuestion = async (): Promise<Question | null> => {
  if (!ai) return null;

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Genera un problema matemático de "palabras" (word problem) para un niño de 9-10 años.
      Tema: Fantasía (magos, dragones, pociones).
      Dificultad: Requiere dos pasos (ej: suma y luego resta, o multiplicación simple).
      Formato de respuesta: JSON estrictamente.
      
      JSON Schema:
      {
        "text": "El texto de la pregunta",
        "correctAnswer": "Solo el número de la respuesta (ej: '15')",
        "options": ["opcion1", "opcion2", "opcion3", "respuesta_correcta"] (mezclados)
      }
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) return null;

    const data = JSON.parse(text);
    
    return {
      id: `ai-${Date.now()}`,
      type: QuestionType.MULTIPLE_CHOICE,
      text: data.text,
      correctAnswer: data.correctAnswer,
      options: data.options.sort(() => Math.random() - 0.5) // Shuffle again just in case
    };

  } catch (error) {
    console.error("Gemini challenge error:", error);
    return null;
  }
};