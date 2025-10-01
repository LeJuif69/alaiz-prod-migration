

import { GoogleGenAI, Type, Chat, FunctionDeclaration } from "@google/genai";

const getMusicalFact = async (): Promise<string> => {
  // AVERTISSEMENT : Cette implémentation expose la clé API côté client.
  // Pour la production, cet appel doit être déplacé vers un backend sécurisé (fonction serverless).
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY n'est pas disponible.");
    return "La musique est la poésie de l'air.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: "Donne-moi un fait amusant ou une citation inspirante sur la musique, en une seule phrase et en français.",
        config: {
            temperature: 0.9,
            maxOutputTokens: 100,
            thinkingConfig: { thinkingBudget: 0 }
        }
    });

    const text = response.text.trim().replace(/^"|"$/g, '');
    return text || "La musique est la langue des esprits. - Khalil Gibran";
  } catch (error) {
    console.error("Erreur lors de la récupération du fait musical depuis Gemini:", error);
    return "La musique est la poésie de l'air.";
  }
};


interface SongChoice {
    artistName: string;
    title: string;
}

const generateAmbiancePlaylist = async (userInput: string, allSongs: { title: string; artistName: string }[]): Promise<SongChoice[]> => {
    // AVERTISSEMENT : Cette implémentation expose la clé API côté client.
    // Pour la production, cet appel doit être déplacé vers un backend sécurisé.
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.error("API_KEY n'est pas disponible.");
        throw new Error("Le service de génération de playlist est indisponible.");
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        const songListForPrompt = allSongs.map(s => `'${s.title}' par ${s.artistName}`).join('; ');

        const prompt = `
            Basé sur la description d'ambiance suivante : "${userInput}", sélectionne entre 3 et 5 chansons dans la liste ci-dessous qui correspondent le mieux à cette ambiance.
            Ne choisis QUE des chansons dans cette liste. Fournis la réponse uniquement au format JSON, sans texte d'introduction ou de conclusion.

            Liste des chansons disponibles :
            ${songListForPrompt}
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        playlist: {
                            type: Type.ARRAY,
                            description: "Une liste de 3 à 5 chansons sélectionnées.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    artistName: { type: Type.STRING, description: "Le nom de l'artiste." },
                                    title: { type: Type.STRING, description: "Le titre de la chanson." }
                                },
                                required: ["artistName", "title"]
                            }
                        }
                    },
                    required: ["playlist"]
                },
                temperature: 0.7
            }
        });
        
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);

        if (!result.playlist || !Array.isArray(result.playlist)) {
            throw new Error("La réponse de l'IA est mal formée.");
        }
        
        return result.playlist;

    } catch (error) {
        console.error("Erreur lors de la génération de la playlist avec Gemini:", error);
        throw new Error("L'IA n'a pas pu générer une playlist valide. Veuillez réessayer.");
    }
};

const createTutorChatSession = (): Chat | null => {
  // AVERTISSEMENT : Cette implémentation expose la clé API côté client.
  // Pour un environnement de production, toute cette logique de chat doit être gérée
  // sur un backend côté serveur pour protéger la clé API. Cela nécessiterait
  // une configuration plus complexe pour gérer l'état de l'historique du chat sur le serveur.
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is not available.");
    return null;
  }
  
  const ai = new GoogleGenAI({ apiKey });
  const systemInstruction = `
    You are an expert music theory tutor for the A Laiz Prod music academy.
    Your name is "Nanhé".
    Your personality is encouraging, patient, and deeply passionate about music.
    You specialize in jazz, gospel, and African music traditions, but you are knowledgeable in all areas of Western music theory.
    Your goal is to make complex topics understandable and exciting for students of all levels.
    - Always respond in French.
    - Keep your answers concise and clear, but don't be afraid to add a touch of passion.
    - Use musical examples when appropriate (e.g., chord progressions like ii-V-I, scales).
    - When you mention musical terms, chords, or notes, enclose them in backticks like \`Cmaj7\`.
    - Format important concepts in bold using asterisks like **ceci est important**.
  `;

  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction,
      temperature: 0.7,
    },
  });

  return chat;
};

const composeMusicFunctionDeclaration: FunctionDeclaration = {
  name: 'composeMusic',
  description: "Compose et génère un morceau de musique basé sur les paramètres fournis par l'utilisateur.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      style: {
        type: Type.STRING,
        description: 'Le style musical (ex: Jazz, Gospel, Afrobeat, Lo-fi).',
        enum: ['Jazz', 'Gospel', 'Afrobeat', 'Lo-fi'],
      },
      tempo: {
        type: Type.STRING,
        description: "Le tempo ou la vitesse du morceau (ex: 'lent', 'moyen', 'rapide').",
        enum: ['lent', 'moyen', 'rapide'],
      },
      instruments: {
        type: Type.ARRAY,
        description: "Une liste d'instruments à inclure.",
        items: {
          type: Type.STRING,
        },
      },
      voice: {
          type: Type.STRING,
          description: "Le type de voix à utiliser (ex: 'Homme', 'Femme', 'Aucune').",
          enum: ['Homme', 'Femme', 'Enfant', 'Chœur', 'Aucune'],
      },
       duration: {
          type: Type.NUMBER,
          description: "La durée approximative du morceau en secondes (entre 30 et 180)."
      }
    },
    required: ['style', 'tempo', 'instruments'],
  },
};


const createChatbotSession = (): Chat | null => {
  // AVERTISSEMENT : Cette implémentation expose la clé API côté client.
  // Pour un environnement de production, toute cette logique de chat doit être gérée
  // sur un backend côté serveur pour protéger la clé API. Cela nécessiterait
  // une configuration plus complexe pour gérer l'état de l'historique du chat sur le serveur.
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is not available for Chatbot.");
    return null;
  }
  
  const ai = new GoogleGenAI({ apiKey });
  const systemInstruction = `
    You are an AI assistant named 'Nanhé' for the music label 'A Laiz Prod'.
    Your personality is that of a passionate and knowledgeable musical maestro.
    Your role is to act as a friendly guide for visitors on the website.
    You are an expert in everything related to the label: its history, artists, services, academy, blog, and events.
    
    You have a special ability: you can compose music directly. When a user asks you to create, compose, or generate a song, use your 'composeMusic' tool. You can have a conversation to clarify what they want (style, tempo, instruments) before calling the function.
    
    - Always respond in French (or English if the user writes in English).
    - Answer questions about the label and its activities.
    - Share your passion for music, especially gospel, jazz, and African music.
    - Keep your answers helpful and relatively concise.
    - If you don't know an answer, politely say so and suggest they contact the label directly.
  `;

  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction,
      temperature: 0.7,
      tools: [{functionDeclarations: [composeMusicFunctionDeclaration]}],
    },
  });

  return chat;
};


export { getMusicalFact, generateAmbiancePlaylist, createTutorChatSession, createChatbotSession };