
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import MetaTags from '../components/MetaTags';

const AdminDashboardPage: React.FC = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <>
            <MetaTags title="Tableau de Bord Admin" />
            <div className="pt-32 pb-16 min-h-screen">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <h1 className="text-5xl font-playfair font-extrabold text-alaiz-gold-light mb-4">
                        Tableau de Bord Administrateur
                    </h1>
                    <p className="text-xl text-alaiz-cream/80 mb-12">
                        Bienvenue, {currentUser?.name}.
                    </p>

                    <div className="bg-alaiz-gray p-8 rounded-lg border border-alaiz-gold/20">
                        <h2 className="text-2xl font-bold text-alaiz-gold mb-4">Actions Rapides</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button className="p-4 bg-alaiz-dark rounded hover:bg-alaiz-black">Gérer les Artistes</button>
                            <button className="p-4 bg-alaiz-dark rounded hover:bg-alaiz-black">Gérer le Blog</button>
                            <button className="p-4 bg-alaiz-dark rounded hover:bg-alaiz-black">Voir les Statistiques</button>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleLogout}
                        className="mt-12 px-8 py-3 bg-red-800 text-white font-bold rounded-full hover:bg-red-700 transition-colors"
                    >
                        Déconnexion
                    </button>
                </div>
            </div>
        </>
    );
};

export default AdminDashboardPage;
