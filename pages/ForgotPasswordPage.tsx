

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MetaTags from '../components/MetaTags';
import { useAuth } from '../contexts/AuthContext';
import BackButton from '../components/BackButton';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { requestPasswordReset } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);
        try {
            await requestPasswordReset(email);
            setMessage("Si un compte existe pour cet email, un lien de réinitialisation a été envoyé.");
        } catch (err: any) {
            setMessage("Une erreur est survenue. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <MetaTags title="Mot de passe oublié" />
            <div className="pt-32 pb-16">
                <div className="container mx-auto px-6 max-w-md">
                    <div className="mb-4"><BackButton to="/connexion" /></div>
                    <div className="bg-alaiz-gray p-8 rounded-lg border border-alaiz-gold/20 shadow-xl mt-4">
                        <h1 className="text-4xl font-playfair font-bold text-alaiz-gold-light text-center mb-6">Mot de passe oublié</h1>
                        <p className="text-center text-alaiz-cream/70 mb-8">Entrez votre email pour recevoir un lien de réinitialisation.</p>

                        {message && <p className="bg-blue-900/50 text-blue-300 p-3 rounded-md mb-6 text-center">{message}</p>}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-alaiz-cream/80">Email</label>
                                <input
                                    type="email" id="email" value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full bg-alaiz-dark border-alaiz-gold/30 rounded-md shadow-sm py-3 px-4 text-alaiz-white focus:outline-none focus:ring-alaiz-gold focus:border-alaiz-gold"
                                    required
                                />
                            </div>
                            <div>
                                <button
                                    type="submit" disabled={loading}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-lg font-bold text-alaiz-black bg-alaiz-gold hover:bg-alaiz-gold-light transition-all duration-300 disabled:bg-alaiz-gray"
                                >
                                    {loading ? 'Envoi...' : 'Envoyer le lien'}
                                </button>
                            </div>
                        </form>

                        <p className="text-center mt-8 text-alaiz-cream/70">
                            Retour à la <Link to="/connexion" className="font-bold text-alaiz-gold hover:underline">connexion</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPasswordPage;