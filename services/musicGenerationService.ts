// --- Interfaces for API parameters ---

export interface SimpleMusicParams {
    prompt: string;
    lyrics: string;
    style: string;
}

export interface AdvancedMusicParams {
    prompt: string;
    key: string;
    tempo: number;
    rhythm: string;
    instruments: string[];
    voice: string;
    duration: number;
    version: 'instrumental' | 'sung';
}

export interface ConversationalMusicParams {
    style?: 'Jazz' | 'Gospel' | 'Afrobeat' | 'Lo-fi';
    tempo?: 'lent' | 'moyen' | 'rapide';
    instruments?: string[];
    voice?: 'Homme' | 'Femme' | 'Enfant' | 'Chœur' | 'Aucune';
    duration?: number;
    prompt?: string;
}

/**
 * Simule un appel à une API de génération musicale pour le mode "Amateur".
 * @param params - Les paramètres du formulaire simple (prompt, paroles, style).
 * @returns Une promesse qui résout avec l'URL d'un fichier audio de démonstration.
 */
export const generateMusicSimple = async (params: SimpleMusicParams): Promise<string> => {
    //
    // --- À REMPLACER PAR VOTRE VÉRITABLE APPEL API ---
    //
    // Dans une application de production, vous feriez un appel `fetch` à votre propre backend
    // qui relaierait de manière sécurisée la requête à l'API de génération musicale (Suno, etc.).
    // Ceci est crucial pour protéger votre clé API.
    //
    // Exemple d'appel backend (à décommenter et adapter) :
    /*
    const API_BACKEND_URL = '/api/generate-music-simple'; // Votre propre endpoint serverless
    
    const response = await fetch(API_BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'La génération de musique a échoué.');
    }

    const result = await response.json();
    return result.audioUrl;
    */
    
    console.log('SIMULATION: Génération avec les paramètres "Amateur" :', params);

    // Simulation d'un long temps de traitement par l'IA (15 secondes)
    await new Promise(resolve => setTimeout(resolve, 15000));

    // Retourne un fichier audio de démonstration.
    console.log('SIMULATION: Génération terminée.');
    return 'https://cdn.pixabay.com/download/audio/2024/05/29/audio_b4b3b3a2ce.mp3';
};

/**
 * Simule un appel à une API de génération musicale pour le mode "Musicien".
 * @param params - Les paramètres détaillés du formulaire avancé.
 * @returns Une promesse qui résout avec l'URL d'un fichier audio de démonstration.
 */
export const generateMusicAdvanced = async (params: AdvancedMusicParams): Promise<string> => {
    //
    // --- À REMPLACER PAR VOTRE VÉRITABLE APPEL API ---
    //
    // Similaire à la fonction simple, cet appel doit passer par votre backend.
    //
    // Exemple d'appel backend (à décommenter et adapter) :
    /*
    const API_BACKEND_URL = '/api/generate-music-advanced';

    const response = await fetch(API_BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'La génération de musique a échoué.');
    }

    const result = await response.json();
    return result.audioUrl;
    */

    console.log('SIMULATION: Génération avec les paramètres "Musicien" :', params);
    
    // Simulation d'un long temps de traitement par l'IA (15 secondes)
    await new Promise(resolve => setTimeout(resolve, 15000));
    
    // Retourne un fichier audio de démonstration. Pour la démo, on retourne toujours
    // une piste instrumentale pour permettre le mixage vocal par l'utilisateur.
    console.log('SIMULATION: Génération terminée.');
    return 'https://cdn.pixabay.com/download/audio/2022/01/24/audio_99b35b659c.mp3';
};


const mapTempo = (tempo: ConversationalMusicParams['tempo']): number => {
    switch (tempo) {
        case 'lent': return 80;
        case 'moyen': return 120;
        case 'rapide': return 160;
        default: return 120;
    }
};

/**
 * Traite les paramètres d'une conversation et appelle le service de génération de musique.
 * @param params - Les paramètres extraits de la conversation par Gemini.
 * @returns Une promesse qui résout avec l'URL d'un fichier audio.
 */
export const generateMusicFromConversation = async (params: ConversationalMusicParams): Promise<string> => {
    const advancedParams: AdvancedMusicParams = {
        prompt: params.prompt || `Un morceau de ${params.style || 'musique'} au tempo ${params.tempo || 'moyen'}`,
        key: 'C Majeur', // Tonalité par défaut pour la simplicité en mode conversationnel
        tempo: mapTempo(params.tempo),
        rhythm: '4/4 Pop/Rock', // Rythme par défaut
        instruments: params.instruments || ['Piano', 'Basse', 'Batterie'],
        voice: params.voice || 'Aucune',
        duration: params.duration || 60,
        version: 'instrumental'
    };

    // Réutilise la logique de génération avancée existante
    return generateMusicAdvanced(advancedParams);
};