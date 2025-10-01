import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAcademyData } from '../services/cmsService';
import { AcademyFormula, Creation } from '../types';
import MetaTags from '../components/MetaTags';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import { UserIcon, BookOpenIcon, SparklesIcon, CogIcon, PlayIcon, DownloadIcon } from '../components/Icons';
import BackButton from '../components/BackButton';

type ProfileView = 'dashboard' | 'edit' | 'courses' | 'creations' | 'preferences';

const ProfilePage: React.FC = () => {
    const { currentUser, updateUser, updatePreferences } = useAuth();
    const [formulas, setFormulas] = useState<readonly AcademyFormula[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState<ProfileView>('dashboard');
    
    // State for editing profile
    const [name, setName] = useState(currentUser?.name || '');
    const [email, setEmail] = useState(currentUser?.email || '');
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    useEffect(() => {
        const fetchFormulas = async () => {
            setLoading(true);
            try {
                if (currentUser?.role === 'Élève') {
                    const academyData = await getAcademyData();
                    setFormulas(academyData.formulas);
                }
            } catch (error) {
                console.error("Failed to load academy data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFormulas();
    }, [currentUser]);
    
    useEffect(() => {
        setName(currentUser?.name || '');
        setEmail(currentUser?.email || '');
    }, [currentUser]);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveMessage('');
        try {
            await updateUser({ name, email });
            setSaveMessage('Profil mis à jour avec succès !');
        } catch (error: any) {
            setSaveMessage(error.message || 'Erreur lors de la mise à jour.');
        } finally {
            setIsSaving(false);
            setTimeout(() => setSaveMessage(''), 3000);
        }
    };
    
    const handlePrefsUpdate = async (prefs: any) => {
        try {
            await updatePreferences(prefs);
        } catch(e) {
            console.error(e)
        }
    }

    if (loading || !currentUser) {
        return <div className="pt-32 pb-16"><Loader message="Chargement du profil..." /></div>;
    }

    const enrolledFormulas = formulas.filter(f => currentUser.courses?.includes(f.id));

    const NavItem: React.FC<{ view: ProfileView; label: string; icon: React.ElementType }> = ({ view, label, icon: Icon }) => (
        <button
            onClick={() => setActiveView(view)}
            className={`flex items-center w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                activeView === view ? 'bg-alaiz-gold/10 text-alaiz-gold-light' : 'text-alaiz-cream/70 hover:bg-alaiz-gray hover:text-alaiz-cream'
            }`}
        >
            <Icon className="w-6 h-6 mr-4" />
            <span className="font-semibold">{label}</span>
        </button>
    );

    const renderContent = () => {
        switch (activeView) {
            case 'edit':
                return (
                    <div>
                        <h2 className="text-3xl font-playfair font-bold text-alaiz-gold-light mb-6">Modifier le profil</h2>
                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                             <div>
                                <label htmlFor="name" className="block text-sm font-medium text-alaiz-cream/80">Nom complet</label>
                                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full bg-alaiz-dark rounded-md p-3" />
                            </div>
                             <div>
                                <label htmlFor="email" className="block text-sm font-medium text-alaiz-cream/80">Adresse e-mail</label>
                                <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full bg-alaiz-dark rounded-md p-3" />
                            </div>
                            <div className="flex items-center gap-4">
                                <button type="submit" disabled={isSaving} className="px-8 py-2 bg-alaiz-gold text-alaiz-black font-bold rounded-full hover:bg-alaiz-gold-light disabled:opacity-50">
                                    {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                                </button>
                                {saveMessage && <p className="text-sm text-alaiz-gold-light">{saveMessage}</p>}
                            </div>
                        </form>
                    </div>
                );
            case 'courses':
                return (
                    <div>
                        <h2 className="text-3xl font-playfair font-bold text-alaiz-gold-light mb-6">Mes Cours</h2>
                        {enrolledFormulas.length > 0 ? (
                            <div className="space-y-6">
                                {enrolledFormulas.map(formula => (
                                    <div key={formula.id} className="bg-alaiz-dark p-6 rounded-lg">
                                        <h3 className="text-2xl font-bold font-playfair text-alaiz-gold">{formula.name}</h3>
                                        <p className="text-alaiz-cream/80 mt-2">{formula.description}</p>
                                        <div className="mt-4">
                                            <p className="text-sm text-alaiz-cream/70 mb-1">Progression (simulée)</p>
                                            <div className="w-full bg-alaiz-black rounded-full h-2.5"><div className="bg-alaiz-gold h-2.5 rounded-full" style={{ width: `${Math.floor(Math.random() * 80) + 10}%` }}></div></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-alaiz-dark rounded-lg border-2 border-dashed border-alaiz-gold/30">
                                <p className="text-xl text-alaiz-cream/80">Vous n'êtes inscrit à aucun cours.</p>
                                <Link to="/academie" className="mt-6 inline-block bg-alaiz-gold text-alaiz-black font-bold px-8 py-3 rounded-full hover:bg-alaiz-gold-light">Découvrir nos formations</Link>
                            </div>
                        )}
                    </div>
                );
            case 'creations':
                 return (
                    <div>
                        <h2 className="text-3xl font-playfair font-bold text-alaiz-gold-light mb-6">Mes Créations (Gombiste IA)</h2>
                        {(currentUser.creations && currentUser.creations.length > 0) ? (
                            <div className="space-y-4">
                                {currentUser.creations.map((creation: Creation) => (
                                    <div key={creation.id} className="bg-alaiz-dark p-4 rounded-lg flex items-center gap-4">
                                        <div className="flex-grow">
                                            <p className="font-semibold text-alaiz-cream truncate">{creation.prompt}</p>
                                            <p className="text-sm text-alaiz-cream/60">{new Date(creation.date).toLocaleString('fr-FR')}</p>
                                        </div>
                                        <audio controls src={creation.url} className="h-10"></audio>
                                        <a href={creation.url} download={`creation-${creation.id}.mp3`} className="p-2 hover:bg-alaiz-gold/20 rounded-full"><DownloadIcon className="w-6 h-6 text-alaiz-gold"/></a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <div className="text-center py-12 bg-alaiz-dark rounded-lg border-2 border-dashed border-alaiz-gold/30">
                                <p className="text-xl text-alaiz-cream/80">Vous n'avez pas encore créé de musique.</p>
                                <Link to="/tutor" className="mt-6 inline-block bg-alaiz-gold text-alaiz-black font-bold px-8 py-3 rounded-full hover:bg-alaiz-gold-light">Lancer Gombiste IA</Link>
                            </div>
                        )}
                    </div>
                );
            case 'preferences':
                const prefs = currentUser.preferences?.notifications;
                return (
                     <div>
                        <h2 className="text-3xl font-playfair font-bold text-alaiz-gold-light mb-6">Préférences de notifications</h2>
                        <div className="space-y-4">
                             <label className="flex items-center justify-between p-4 bg-alaiz-dark rounded-lg">
                                <span>Me notifier des nouveaux articles de blog</span>
                                <input type="checkbox" className="toggle" checked={prefs?.newBlog} onChange={e => handlePrefsUpdate({ ...currentUser.preferences, notifications: { ...prefs, newBlog: e.target.checked }})} />
                            </label>
                             <label className="flex items-center justify-between p-4 bg-alaiz-dark rounded-lg">
                                <span>Me notifier des nouveaux événements</span>
                                <input type="checkbox" className="toggle" checked={prefs?.newEvents} onChange={e => handlePrefsUpdate({ ...currentUser.preferences, notifications: { ...prefs, newEvents: e.target.checked }})} />
                            </label>
                             <label className="flex items-center justify-between p-4 bg-alaiz-dark rounded-lg">
                                <span>Recevoir des recommandations personnalisées</span>
                                <input type="checkbox" className="toggle" checked={prefs?.recommendations} onChange={e => handlePrefsUpdate({ ...currentUser.preferences, notifications: { ...prefs, recommendations: e.target.checked }})} />
                            </label>
                        </div>
                    </div>
                );
            default: // dashboard
                return (
                    <div>
                        <h2 className="text-3xl font-playfair font-bold text-alaiz-gold-light mb-6">Tableau de bord</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-alaiz-dark p-6 rounded-lg">
                                <h3 className="font-bold text-lg text-alaiz-gold">Prochain cours</h3>
                                <p className="mt-2">{currentUser.role === 'Élève' && enrolledFormulas.length > 0 ? enrolledFormulas[0].name : "Aucun cours à venir"}</p>
                            </div>
                            <div className="bg-alaiz-dark p-6 rounded-lg">
                                <h3 className="font-bold text-lg text-alaiz-gold">Dernière création</h3>
                                 <p className="mt-2 truncate">{currentUser.creations && currentUser.creations.length > 0 ? currentUser.creations[0].prompt : "Aucune création récente"}</p>
                            </div>
                        </div>
                    </div>
                );
        }
    }

    return (
        <>
            <MetaTags title="Mon Profil" />
            <div className="pt-32 pb-16">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="mb-4"><BackButton /></div>
                    <div className="text-center">
                        <h1 className="text-5xl font-playfair font-extrabold text-alaiz-gold-light mb-4">
                            Bienvenue, {currentUser.name.split(' ')[0]} !
                        </h1>
                        <p className="text-xl text-alaiz-cream/80 mb-12 max-w-3xl mx-auto">Gérez votre compte et votre expérience A Laiz Prod ici.</p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        <aside className="md:w-1/4 flex-shrink-0">
                            <div className="bg-alaiz-gray p-4 rounded-lg space-y-2">
                                <NavItem view="dashboard" label="Tableau de bord" icon={UserIcon} />
                                <NavItem view="edit" label="Modifier le profil" icon={UserIcon} />
                                {currentUser.role === 'Élève' && <NavItem view="courses" label="Mes Cours" icon={BookOpenIcon} />}
                                <NavItem view="creations" label="Mes Créations" icon={SparklesIcon} />
                                <NavItem view="preferences" label="Préférences" icon={CogIcon} />
                            </div>
                        </aside>
                        <main className="flex-1 bg-alaiz-gray p-8 rounded-lg">
                            {renderContent()}
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;