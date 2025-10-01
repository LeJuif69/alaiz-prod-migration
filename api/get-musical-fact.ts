
import { GoogleGenAI } from "@google/genai";

// Ceci est une fonction serverless. Elle appelle de manière sécurisée l'API Gemini
// avec la clé API stockée dans les variables d'environnement sur le serveur.
// Les types `req` et `res` sont `any` car nous ne connaissons pas le framework serverless spécifique.
// Ils seraient remplacés par des types comme `VercelRequest` et `VercelResponse` dans un projet Vercel.

export default async function handler(req: any, res: any) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.error("API_KEY n'est pas configurée sur le serveur.");
        return res.status(500).json({ error: "Erreur de configuration du serveur." });
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
        const fact = text || "La musique est la langue des esprits. - Khalil Gibran";

        return res.status(200).json({ fact });

    } catch (error) {
        console.error("Erreur lors de l'appel à l'API Gemini:", error);
        return res.status(500).json({ error: "Échec de la récupération du fait musical." });
    }
}
