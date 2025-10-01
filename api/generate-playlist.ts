
import { GoogleGenAI, Type } from "@google/genai";

// Ceci est une fonction serverless. Elle appelle de manière sécurisée l'API Gemini
// avec la clé API stockée dans les variables d'environnement sur le serveur.
// Les types `req` et `res` sont `any` pour la compatibilité.

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.error("API_KEY n'est pas configurée sur le serveur.");
        return res.status(500).json({ error: "Erreur de configuration du serveur." });
    }

    try {
        const { userInput, allSongs } = req.body;

        if (!userInput || !allSongs || !Array.isArray(allSongs)) {
            return res.status(400).json({ error: 'Paramètres manquants ou invalides : userInput et allSongs sont requis.' });
        }

        const ai = new GoogleGenAI({ apiKey });
        const songListForPrompt = allSongs.map((s: any) => `'${s.title}' par ${s.artistName}`).join('; ');

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
        
        return res.status(200).json({ playlist: result.playlist });

    } catch (error) {
        console.error("Erreur lors de l'appel à l'API Gemini pour la playlist:", error);
        return res.status(500).json({ error: "Échec de la génération de la playlist." });
    }
}
