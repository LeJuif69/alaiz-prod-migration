
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MetaTags from '../components/MetaTags';
import BackButton from '../components/BackButton';

const AdminLoginPage: React.FC = () => {
    const [email, setEmail] = useState('admin@alaizprod.art');
    const [password, setPassword] = useState('adminpassword');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { adminLogin } = useAuth(); // Using the new adminLogin function
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await adminLogin(email, password);
            navigate('/admin/dashboard', { replace: true });
        } catch (err: any) {
            setError(err.message || "La connexion a échoué. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <MetaTags title="Connexion Admin" description="Portail de connexion pour l'administration du site A Laiz Prod." />
            <div className="pt-32 pb-16 min-h-screen flex items-center">
                <div className="container mx-auto px-6 max-w-md">
                    <div className="absolute top-24 left-6"><BackButton to="/" /></div>
                    <div className="bg-alaiz-gray p-8 rounded-lg border border-alaiz-gold/20 shadow-xl mt-4">
                        <h1 className="text-4xl font-playfair font-bold text-alaiz-gold-light text-center mb-6">Accès Admin</h1>
                        
                        {error && <p className="bg-red-900/50 text-red-300 p-3 rounded-md mb-6 text-center">{error}</p>}
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-alaiz-cream/80">Email Administrateur</label>
                                <input
                                    type="email" id="email" value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full bg-alaiz-dark border-alaiz-gold/30 rounded-md shadow-sm py-3 px-4 text-alaiz-white focus:outline-none focus:ring-alaiz-gold focus:border-alaiz-gold"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-alaiz-cream/80">Mot de passe</label>
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
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminLoginPage;
