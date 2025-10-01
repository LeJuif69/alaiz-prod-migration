import { ALAIZ_DATA } from '../constants';

// --- Simulation d'une base de données en mémoire ---

// Cette Map simule la colonne `user_gems` (ou "J'aime" des utilisateurs).
// Elle ne stocke que les interactions des utilisateurs, en partant de 0 pour chaque article.
const userLikesDB = new Map<number, number>();

// Cette Map est une copie en cache des "J'aime" par défaut (`default_gems`).
// Elle est initialisée une seule fois à partir des données statiques.
const defaultLikesDB = new Map<number, number>();
if (defaultLikesDB.size === 0) {
    ALAIZ_DATA.blogPosts.forEach(post => {
        defaultLikesDB.set(post.id, post.likes || 0);
    });
    console.log('Default Likes DB Initialized on serverless instance.');
}
// --- Fin de la simulation de base de données ---

// Le handler de la fonction serverless
export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    try {
        const { postId, action } = req.body;

        if (typeof postId !== 'number' || (action !== 'like' && action !== 'unlike')) {
            return res.status(400).json({ error: 'Paramètres invalides. "postId" (number) et "action" ("like" ou "unlike") sont requis.' });
        }

        const defaultLikes = defaultLikesDB.get(postId);

        if (defaultLikes === undefined) {
            return res.status(404).json({ error: `Article avec l'ID ${postId} non trouvé.` });
        }
        
        // Récupère les "J'aime" actuels des utilisateurs, ou 0 s'il n'y en a pas encore.
        const currentUserLikes = userLikesDB.get(postId) || 0;

        // Met à jour le compteur des "J'aime" des utilisateurs en fonction de l'action.
        // Le nombre de "J'aime" des utilisateurs ne peut pas descendre en dessous de 0.
        const newUserLikes = action === 'like' 
            ? currentUserLikes + 1 
            : Math.max(0, currentUserLikes - 1);
            
        userLikesDB.set(postId, newUserLikes);

        // Calcule le total des "J'aime" (valeur par défaut + interactions des utilisateurs).
        const totalLikes = defaultLikes + newUserLikes;

        console.log(`Updated likes for post ${postId}: Default=${defaultLikes}, User=${newUserLikes}, Total=${totalLikes}`);

        // Renvoie le nouveau total de "J'aime"
        return res.status(200).json({ newLikes: totalLikes });

    } catch (error) {
        console.error('Erreur dans la fonction like-post:', error);
        return res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
}
