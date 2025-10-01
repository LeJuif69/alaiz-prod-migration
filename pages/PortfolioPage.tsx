

import React, { useState, useMemo, useEffect } from 'react';
import Section from '../components/Section';
import { getPortfolio } from '../services/cmsService';
import { PortfolioItem } from '../types';
import { XIcon, DownloadIcon, MusicIcon, PlayIcon, PauseIcon } from '../components/Icons';
import MetaTags from '../components/MetaTags';
import Loader from '../components/Loader';
import ErrorDisplay from '../components/ErrorDisplay';
import BackButton from '../components/BackButton';
import WatermarkedImage from '../components/WatermarkedImage';

const Lightbox: React.FC<{ item: PortfolioItem; onClose: () => void }> = ({ item, onClose }) => {
    const audioRef = React.useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
           if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';
        return () => {
          window.removeEventListener('keydown', handleEsc);
          document.body.style.overflow = 'unset';
        };
    }, [onClose]);

    const toggleAudio = () => {
        if (audioRef.current) {
            if (isPlaying) audioRef.current.pause();
            else audioRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };
    
    return (
     <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 animate-fade-in-up" style={{ animationDuration: '0.3s' }} onClick={onClose}>
        <div className="relative w-full max-w-6xl max-h-[90vh] bg-alaiz-dark rounded-lg overflow-hidden flex flex-col md:flex-row shadow-2xl shadow-alaiz-gold/20" onClick={e => e.stopPropagation()}>
            <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-alaiz-gold transition-colors z-50">
                <XIcon className="w-8 h-8" />
            </button>
            <div className="md:w-[60%] lg:w-2/3 bg-black flex items-center justify-center">
                 {item.media.video_url ? (
                    <div className="aspect-video w-full">
                        <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${item.media.video_url}?autoplay=1&rel=0`} title={item.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    </div>
                ) : item.media.audio_url ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-cover bg-center" style={{backgroundImage: `url(${item.cover_image})`}}>
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
                        <div className="relative text-center">
                             <WatermarkedImage src={item.cover_image} alt={item.title} className="w-64 h-64 rounded-lg shadow-lg mb-8" />
                             <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                             <p className="text-alaiz-cream/80">{item.artists.join(', ')}</p>
                             <button onClick={toggleAudio} className="mt-6 bg-alaiz-gold text-alaiz-black w-16 h-16 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform">
                                {isPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8 ml-1" />}
                             </button>
                             <audio ref={audioRef} src={item.media.audio_url} onEnded={() => setIsPlaying(false)} className="hidden" />
                        </div>
                    </div>
                ) : (
                    <WatermarkedImage src={item.cover_image} alt={item.title} className="max-w-full max-h-full object-contain" />
                )}
            </div>
            <div className="md:w-[40%] lg:w-1/3 p-6 lg:p-8 overflow-y-auto">
                 <h2 className="text-3xl font-playfair font-bold text-alaiz-gold-light">{item.title}</h2>
                 <p className="text-alaiz-gold mt-1 capitalize">{item.type} &bull; {item.year}</p>
                 <div className="mt-6 space-y-6 text-sm text-alaiz-cream/90 leading-relaxed">
                    <div>
                        <h4 className="font-bold text-alaiz-gold-light mb-2 border-b border-alaiz-gold/20 pb-1">Description</h4>
                        <p>{item.description}</p>
                    </div>
                     <div>
                        <h4 className="font-bold text-alaiz-gold-light mb-2 border-b border-alaiz-gold/20 pb-1">Étude de Cas</h4>
                        <p>{item.case_study}</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-alaiz-gold-light mb-2 border-b border-alaiz-gold/20 pb-1">Crédits</h4>
                        <ul className="space-y-1">
                           {item.credits.producer && <li><strong>Producteur:</strong> {item.credits.producer}</li>}
                           {item.credits.director && <li><strong>Réalisateur:</strong> {item.credits.director}</li>}
                           {item.credits.engineer && <li><strong>Ingénieur du son:</strong> {item.credits.engineer}</li>}
                        </ul>
                    </div>
                     {item.downloadable_assets.length > 0 && (
                        <div>
                            <h4 className="font-bold text-alaiz-gold-light mb-2 border-b border-alaiz-gold/20 pb-1">Ressources</h4>
                            <div className="flex flex-col items-start gap-3 mt-3">
                                {item.downloadable_assets.map(asset => (
                                    <a key={asset} href={`/assets/${asset}`} download className="inline-flex items-center gap-2 bg-alaiz-gray px-4 py-2 rounded-full font-semibold hover:bg-alaiz-black hover:text-alaiz-gold transition-colors">
                                        <DownloadIcon className="w-4 h-4" />
                                        <span>{asset.split('_').join(' ').replace(/\.(zip|pdf)/, '')}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                     )}
                 </div>
            </div>
        </div>
    </div>
    );
};

const PortfolioCard: React.FC<{ item: PortfolioItem; onSelect: () => void }> = ({ item, onSelect }) => (
    <div
        className="group relative aspect-square bg-alaiz-gray rounded-lg overflow-hidden cursor-pointer shadow-lg"
        onClick={onSelect}
    >
        <WatermarkedImage src={item.cover_image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4">
            <h3 className="font-playfair font-bold text-white text-xl leading-tight drop-shadow-md">{item.title}</h3>
            <p className="text-sm text-alaiz-gold-light capitalize">{item.type}</p>
        </div>
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="font-bold text-lg text-alaiz-gold border-2 border-alaiz-gold rounded-full px-5 py-2">Voir le projet</span>
        </div>
    </div>
);

const PortfolioPage: React.FC = () => {
    const [portfolioItems, setPortfolioItems] = useState<Readonly<PortfolioItem[]>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
    const [activeType, setActiveType] = useState('Tous');
    const [activeYear, setActiveYear] = useState('Tous');

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                setLoading(true);
                const items = await getPortfolio();
                setPortfolioItems(items);
            } catch (err) {
                setError("Impossible de charger le portfolio.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPortfolio();
    }, []);

    const { types, years, filteredItems } = useMemo(() => {
        const types = ['Tous', ...Array.from(new Set(portfolioItems.map(item => item.type)))];
        // FIX: Add explicit string types to the sort callback parameters to fix type inference issue.
        const years = ['Tous', ...Array.from(new Set(portfolioItems.map(item => item.year.toString()))).sort((a: string, b: string) => parseInt(b) - parseInt(a))];

        const filtered = portfolioItems.filter(item => {
            const typeMatch = activeType === 'Tous' || item.type === activeType;
            const yearMatch = activeYear === 'Tous' || item.year.toString() === activeYear;
            return typeMatch && yearMatch;
        });

        return { types, years, filteredItems: filtered };
    }, [portfolioItems, activeType, activeYear]);
    
    return (
        <>
            <MetaTags title="Portfolio" description="Découvrez nos réalisations en clips, sessions live, productions et collaborations artistiques." keywords="portfolio, réalisations, clips, live, studio, collaborations" />
            <div className="pt-32 pb-16 bg-alaiz-gray/50">
                <div className="container mx-auto px-6">
                    <div className="mb-4"><BackButton /></div>
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl font-playfair font-extrabold text-alaiz-gold-light">Notre Portfolio</h1>
                        <p className="mt-4 text-xl text-alaiz-cream/80 max-w-3xl mx-auto">Explorez la diversité de notre travail et découvrez les coulisses de nos projets phares.</p>
                    </div>
                </div>
            </div>

            <Section title="Nos Réalisations" subtitle="Filtrez par catégorie pour explorer la diversité de notre travail.">
                {loading && <Loader message="Chargement des projets..." />}
                {error && <ErrorDisplay message={error} />}
                
                {!loading && !error && (
                    <>
                        <div className="flex justify-center flex-wrap gap-x-4 gap-y-3 mb-12">
                            <div className="flex items-center gap-2 text-sm">
                                <span className="font-semibold text-alaiz-cream/70">Type:</span>
                                {types.map(type => (
                                    <button key={type} onClick={() => setActiveType(type)} className={`px-4 py-1 rounded-full font-bold transition-all text-sm ${activeType === type ? 'bg-alaiz-gold text-alaiz-black' : 'bg-alaiz-gray text-alaiz-cream hover:bg-alaiz-gold/20'}`}>
                                        {type}
                                    </button>
                                ))}
                            </div>
                             <div className="flex items-center gap-2 text-sm">
                                <span className="font-semibold text-alaiz-cream/70">Année:</span>
                                {years.map(year => (
                                    <button key={year} onClick={() => setActiveYear(year)} className={`px-4 py-1 rounded-full font-bold transition-all text-sm ${activeYear === year ? 'bg-alaiz-gold text-alaiz-black' : 'bg-alaiz-gray text-alaiz-cream hover:bg-alaiz-gold/20'}`}>
                                        {year}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredItems.map(item => (
                                <div key={item.id} className="animate-fade-in-up" style={{animationDuration: '0.5s'}}>
                                    <PortfolioCard item={item} onSelect={() => setSelectedItem(item)} />
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </Section>

            {selectedItem && <Lightbox item={selectedItem} onClose={() => setSelectedItem(null)} />}
        </>
    );
};

export default PortfolioPage;