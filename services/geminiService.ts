
import { GoogleGenAI, Type } from "@google/genai";
import { Level, Question } from "../types";

// Always initialize with the direct named parameter for API key.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  async generateLesson(topic: string, level: Level): Promise<string> {
    // Upgraded to gemini-3-pro-preview for advanced reasoning and complex educational formatting.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Génère un cours de physique détaillé en français pour le niveau ${level} sur le thème : "${topic}". 
      Inclus des définitions claires, les formules clés (en LaTeX si possible), des exemples concrets et une petite conclusion. 
      Utilise un format Markdown élégant.`,
    });
    return response.text || "Erreur lors de la génération du cours.";
  },

  async explainConcept(concept: string, level: Level): Promise<string> {
    // Upgraded to gemini-3-pro-preview for better conceptual analogies and reasoning.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Explique le concept de physique suivant de manière pédagogique et simple pour un élève de niveau ${level} : "${concept}". 
      Utilise des analogies de la vie quotidienne pour faciliter la compréhension. Réponds en français.`,
    });
    return response.text || "Erreur lors de l'explication.";
  },

  async generateExercises(topic: string, level: Level): Promise<Question[]> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Génère un quiz de 5 questions à choix multiples (QCM) sur le sujet "${topic}" pour un niveau ${level}. 
      Chaque question doit avoir 4 options. Inclus une explication détaillée pour la bonne réponse. Langue: Français.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              correctAnswer: { type: Type.INTEGER, description: "Index (0-3) de la réponse correcte" },
              explanation: { type: Type.STRING }
            },
            required: ["id", "question", "options", "correctAnswer", "explanation"]
          }
        }
      }
    });

    try {
    // On récupère le texte de la réponse de manière sécurisée
    const responseText = response && typeof response.text === 'function' ? await response.text() : "";
    
    // On utilise bien la variable qu'on vient de créer pour le parse
    return JSON.parse(responseText);
  } catch (e) {
    console.error("Failed to parse exercises", e);
    return [];
  }
  }
};
