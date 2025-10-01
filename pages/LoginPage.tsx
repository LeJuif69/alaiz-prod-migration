import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MetaTags from '../components/MetaTags';
import { FacebookIcon, GoogleIcon } from '../components/Icons'; // Assurez-vous d'avoir une GoogleIcon
import BackButton from '../components/BackButton';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('herve@test.com');
    const [password, setPassword] = useState('password');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login, loginWithProvider } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/profil';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err.message || "La connexion a échoué. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    const handleOAuth = async (provider: 'Google' | 'Facebook') => {
        setError('');
        setLoading(true);
        try {
            await loginWithProvider(provider);
            navigate(from, { replace: true });
        } catch (err: any) {
             setError(err.message || `La connexion avec ${provider} a échoué.`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <MetaTags title="Connexion" description="Connectez-vous à votre espace A Laiz Prod." />
            <div className="pt-32 pb-16">
                <div className="container mx-auto px-6 max-w-md">
                    <div className="mb-4"><BackButton /></div>
                    <div className="bg-alaiz-gray p-8 rounded-lg border border-alaiz-gold/20 shadow-xl mt-4">
                        <h1 className="text-4xl font-playfair font-bold text-alaiz-gold-light text-center mb-6">Connexion</h1>
                        
                        {error && <p className="bg-red-900/50 text-red-300 p-3 rounded-md mb-6 text-center">{error}</p>}
                        
                        <div className="flex flex-col gap-4 mb-6">
                            <button onClick={() => handleOAuth('Google')} disabled={loading} className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-alaiz-cream/20 rounded-full hover:bg-alaiz-dark transition-colors">
                                <GoogleIcon className="w-6 h-6" /> Continuer avec Google
                            </button>
                             <button onClick={() => handleOAuth('Facebook')} disabled={loading} className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-alaiz-cream/20 rounded-full hover:bg-alaiz-dark transition-colors">
                                <FacebookIcon className="w-6 h-6" /> Continuer avec Facebook
                            </button>
                        </div>

                        <div className="flex items-center my-6">
                            <hr className="flex-grow border-t border-alaiz-cream/20" />
                            <span className="mx-4 text-alaiz-cream/50">OU</span>
                            <hr className="flex-grow border-t border-alaiz-cream/20" />
                        </div>

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
                                <div className="flex justify-between items-center">
                                    <label htmlFor="password" className="block text-sm font-medium text-alaiz-cream/80">Mot de passe</label>
                                    <Link to="/mot-de-passe-oublie" className="text-sm text-alaiz-gold hover:underline">Mot de passe oublié ?</Link>
                                </div>
                                <input
                                    type="password" id="password" value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full bg-alaiz-dark border-alaiz-gold/30 rounded-md shadow-sm py-3 px-4 text-alaiz-white focus:outline-none focus:ring-alaiz-gold focus:border-alaiz-gold"
                                    required
                                />
                            </div>
                            <div>
                                <button
                                    type="submit" disabled={loading}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-lg font-bold text-alaiz-black bg-alaiz-gold hover:bg-alaiz-gold-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-alaiz-gold-light transition-all duration-300 disabled:bg-alaiz-gray disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Connexion...' : 'Se connecter'}
                                </button>
                            </div>
                        </form>

                        <p className="text-center mt-8 text-alaiz-cream/70">
                            Pas encore de compte ? <Link to="/inscription" className="font-bold text-alaiz-gold hover:underline">Inscrivez-vous</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;