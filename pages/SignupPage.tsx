import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MetaTags from '../components/MetaTags';
import { FacebookIcon, GoogleIcon } from '../components/Icons';
import BackButton from '../components/BackButton';

const SignupPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'Élève' | 'Artiste'>('Élève');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { signup, loginWithProvider } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signup(name, email, password, role);
            navigate('/profil');
        } catch (err: any) {
            setError(err.message || "L'inscription a échoué. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };
    
    const handleOAuth = async (provider: 'Google' | 'Facebook') => {
        setError('');
        setLoading(true);
        try {
            await loginWithProvider(provider);
            navigate('/profil');
        } catch (err: any) {
             setError(err.message || `L'inscription avec ${provider} a échoué.`);
        } finally {
            setLoading(false);
        }
    }


    return (
        <>
            <MetaTags title="Inscription" description="Créez votre compte A Laiz Prod pour accéder à nos services." />
            <div className="pt-32 pb-16">
                <div className="container mx-auto px-6 max-w-md">
                    <div className="mb-4"><BackButton /></div>
                    <div className="bg-alaiz-gray p-8 rounded-lg border border-alaiz-gold/20 shadow-xl mt-4">
                        <h1 className="text-4xl font-playfair font-bold text-alaiz-gold-light text-center mb-6">Créer un compte</h1>
                        
                        {error && <p className="bg-red-900/50 text-red-300 p-3 rounded-md mb-6 text-center">{error}</p>}
                        
                        <div className="flex flex-col gap-4 mb-6">
                            <button onClick={() => handleOAuth('Google')} disabled={loading} className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-alaiz-cream/20 rounded-full hover:bg-alaiz-dark transition-colors">
                                <GoogleIcon className="w-6 h-6" /> S'inscrire avec Google
                            </button>
                             <button onClick={() => handleOAuth('Facebook')} disabled={loading} className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-alaiz-cream/20 rounded-full hover:bg-alaiz-dark transition-colors">
                                <FacebookIcon className="w-6 h-6" /> S'inscrire avec Facebook
                            </button>
                        </div>

                         <div className="flex items-center my-6">
                            <hr className="flex-grow border-t border-alaiz-cream/20" />
                            <span className="mx-4 text-alaiz-cream/50">OU</span>
                            <hr className="flex-grow border-t border-alaiz-cream/20" />
                        </div>


                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-alaiz-cream/80">Nom complet</label>
                                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full bg-alaiz-dark border-alaiz-gold/30 rounded-md shadow-sm py-3 px-4 text-alaiz-white focus:outline-none focus:ring-alaiz-gold focus:border-alaiz-gold" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-alaiz-cream/80">Email</label>
                                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full bg-alaiz-dark border-alaiz-gold/30 rounded-md shadow-sm py-3 px-4 text-alaiz-white focus:outline-none focus:ring-alaiz-gold focus:border-alaiz-gold" />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-alaiz-cream/80">Mot de passe</label>
                                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full bg-alaiz-dark border-alaiz-gold/30 rounded-md shadow-sm py-3 px-4 text-alaiz-white focus:outline-none focus:ring-alaiz-gold focus:border-alaiz-gold" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-alaiz-cream/80">Je suis un(e)...</label>
                                <div className="mt-2 flex gap-4">
                                    <label className="flex items-center gap-2 text-alaiz-cream"><input type="radio" value="Élève" checked={role === 'Élève'} onChange={() => setRole('Élève')} className="form-radio bg-alaiz-dark text-alaiz-gold focus:ring-alaiz-gold" /> Élève</label>
                                    <label className="flex items-center gap-2 text-alaiz-cream"><input type="radio" value="Artiste" checked={role === 'Artiste'} onChange={() => setRole('Artiste')} className="form-radio bg-alaiz-dark text-alaiz-gold focus:ring-alaiz-gold" /> Artiste</label>
                                </div>
                            </div>
                            <div>
                                <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-lg font-bold text-alaiz-black bg-alaiz-gold hover:bg-alaiz-gold-light transition-all duration-300 disabled:bg-alaiz-gray disabled:cursor-not-allowed">
                                    {loading ? 'Création...' : "S'inscrire"}
                                </button>
                            </div>
                        </form>

                        <p className="text-center mt-8 text-alaiz-cream/70">
                            Déjà un compte ? <Link to="/connexion" className="font-bold text-alaiz-gold hover:underline">Connectez-vous</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignupPage;