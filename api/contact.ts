
// Ceci est une fonction serverless pour gérer la soumission du formulaire de contact.
// Les types `req` et `res` sont `any` car nous ne connaissons pas le framework serverless spécifique.

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    // Dans la plupart des frameworks serverless, le corps est déjà parsé en JSON.
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }

    // Dans une application réelle, vous utiliseriez un service comme Nodemailer
    // ou une API d'email (SendGrid, Mailgun) pour envoyer l'email.
    // Pour cette démonstration, nous allons simplement le logger sur la console du serveur.
    console.log('--- Nouvelle soumission du formulaire de contact ---');
    console.log(`Nom: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Message: ${message}`);
    console.log('-------------------------------------------');

    // Simuler un processus d'envoi d'email réussi.
    return res.status(200).json({ message: 'Message reçu avec succès' });

  } catch (error) {
    console.error('Erreur lors du traitement du formulaire de contact:', error);
    if (error instanceof SyntaxError) {
        // Cela se produirait si le corps n'est pas un JSON valide
        return res.status(400).json({ error: 'Corps JSON invalide' });
    }
    return res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}
