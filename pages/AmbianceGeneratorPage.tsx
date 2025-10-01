import React, { useState, useMemo } from 'react';
import Section from '../components/Section';
import { ALAIZ_DATA } from '../constants';
import { generateAmbiancePlaylist } from '../services/geminiService';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';
import { PlayIcon, SparklesIcon } from '../components/Icons';
import MetaTags from '../components/MetaTags';
import { DiscographyItem } from '../types';
import BackButton from '../components/BackButton';

interface PlaylistItem extends DiscographyItem {
    artistName: string;
}

const AmbianceGeneratorPage: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
    
    const { playCustomPlaylist, currentTrack, isPlaying } = useMusicPlayer();

    const allSongs = useMemo(() => {
        return ALAIZ_DATA.artists.flatMap(artist =>
            artist.discography.map(song => ({
                ...song,
                artistName: artist.name,
            }))
        );
    }, []);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError("Veuillez décrire une ambiance.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setPlaylist([]);

        try {
            const songChoices = await generateAmbiancePlaylist(prompt, allSongs.map(s => ({ title: s.title, artistName: s.artistName })));
            
            const generatedPlaylist = songChoices.map(choice => {
                return allSongs.find(song => song.title === choice.title && song.artistName === choice.artistName);
            }).filter((song): song is PlaylistItem => song !== undefined);

            if (generatedPlaylist.length === 0) {
                 throw new Error("L'IA n'a pas pu trouver de chansons correspondantes. Essayez une autre description.");
            }

            setPlaylist(generatedPlaylist);

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Une erreur est survenue lors de la génération de la playlist.");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePlay = (trackIndex: number) => {
        playCustomPlaylist(playlist, trackIndex);
    };

    return (
        <>
            <MetaTags 
                title="Générateur d'Ambiance" 
                description="Décrivez une ambiance et laissez notre IA créer une playlist sur mesure à partir du catalogue A Laiz Prod."
            />
             <div className="pt-24 pb-16 bg-alaiz-gray/50">
                <div className="container mx-auto px-6">
                    <div className="mb-4"><BackButton /></div>
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl font-playfair font-extrabold text-alaiz-gold-light">Générateur d'Ambiance</h1>
                        <p className="mt-4 text-xl text-alaiz-cream/80 max-w-3xl mx-auto">Décrivez un sentiment, un moment ou une activité, et laissez l'IA créer votre bande-son parfaite.</p>
                    </div>
                </div>
            </div>

            <Section title="Quelle est votre ambiance ?" subtitle="Soyez créatif ! Plus votre description est précise, meilleure sera la sélection.">
                <div className="max-w-2xl mx-auto bg-alaiz-gray p-8 rounded-lg border border-alaiz-gold/20">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ex: 'Une soirée jazz relaxante entre amis', 'Motivation pour travailler', 'Un dimanche après-midi mélancolique'..."
                        rows={4}
                        className="w-full bg-alaiz-dark border-alaiz-gold/30 rounded-md shadow-sm py-3 px-4 text-alaiz-white focus:outline-none focus:ring-2 focus:ring-alaiz-gold focus:border-alaiz-gold transition-all"
                        aria-label="Description de l'ambiance"
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="mt-6 w-full flex items-center justify-center py-4 px-6 border border-transparent rounded-full shadow-sm text-lg font-bold text-alaiz-black bg-alaiz-gold hover:bg-alaiz-gold-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-alaiz-gold-light transition-all duration-300 disabled:bg-alaiz-gray disabled:cursor-not-allowed transform hover:scale-105"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-alaiz-black mr-3"></div>
                                Génération en cours...
                            </>
                        ) : (
                            <>
                                <SparklesIcon className="w-6 h-6 mr-3" />
                                Générer la playlist
                            </>
                        )}
                    </button>
                    {error && <p className="text-red-400 text-center mt-4">{error}</p>}
                </div>
            </Section>

            {playlist.length > 0 && (
                <Section title="Votre Playlist Personnalisée" subtitle="Voici la sélection de l'IA, conçue spécialement pour vous.">
                    <div className="max-w-3xl mx-auto space-y-4">
                        {playlist.map((track, index) => (
                             <div 
                                key={index} 
                                className={`flex items-center p-4 rounded-lg transition-all duration-300 animate-fade-in-up ${currentTrack?.title === track.title && currentTrack.artistName === track.artistName ? 'bg-alaiz-gold/20' : 'bg-alaiz-gray hover:bg-alaiz-dark'}`}
                                style={{animationDelay: `${index * 0.1}s`}}
                             >
                                <img src={track.coverUrl} alt={track.title} className="w-16 h-16 rounded-md object-cover mr-4 shadow-md" loading="lazy" decoding="async"/>
                                <div className="flex-grow">
                                    <p className={`font-bold text-lg ${currentTrack?.title === track.title && isPlaying ? 'text-alaiz-gold-light' : 'text-alaiz-cream'}`}>{track.title}</p>
                                    <p className="text-alaiz-cream/70">{track.artistName}</p>
                                </div>
                                <button 
                                    onClick={() => handlePlay(index)} 
                                    className="bg-alaiz-gold text-alaiz-black rounded-full w-12 h-12 flex items-center justify-center hover:bg-alaiz-gold-light transition-colors transform hover:scale-110"
                                    aria-label={`Jouer ${track.title}`}
                                >
                                    <PlayIcon className="w-6 h-6 ml-1" />
                                </button>
                            </div>
                        ))}
                    </div>
                </Section>
            )}
        </>
    );
};

export default AmbianceGeneratorPage;