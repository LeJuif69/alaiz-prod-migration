
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Section from '../components/Section';
import { getArtists, getServices, getLabelInfo, getPageSlogans, getLabelAbout, getNews, getPressKit, getBookingBlock } from '../services/cmsService';
import type { Artist, Service, DiscographyItem, LabelAbout, NewsItem, PressKit, BookingBlock } from '../types';
import MetaTags from '../components/MetaTags';
import { generateAmbiancePlaylist } from '../services/geminiService';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';
import { PlayIcon, SparklesIcon, CheckCircleIcon, DownloadIcon, BuildingOfficeIcon, UserIcon, MapPinIcon, EnvelopeIcon } from '../components/Icons';
import Loader from '../components/Loader';
import ErrorDisplay from '../components/ErrorDisplay';
import BackButton from '../components/BackButton';
import WatermarkedImage from '../components/WatermarkedImage';

interface PlaylistItem extends DiscographyItem {
    artistName: string;
}

const generatePexelsSrcSet = (baseUrl: string) => {
    if (!baseUrl || !baseUrl.includes('pexels.com')) {
        return {};
    }
    try {
        const url = new URL(baseUrl);
        const base = `${url.protocol}//${url.host}${url.pathname}`;
        const originalParams = new URLSearchParams(url.search);
        originalParams.delete('w');
        originalParams.delete('h');

        const widths = [400, 600, 800];
        const srcset = widths.map(w => {
            const params = new URLSearchParams(originalParams);
            params.set('w', w.toString());
            params.set('h', Math.round(w * (5 / 4)).toString());
            return `${base}?${params.toString()} ${w}w`;
        }).join(', ');
        
        return { srcSet: srcset };
    } catch (e) {
        console.error("Invalid URL for srcset generation:", baseUrl, e);
        return {};
    }
};

const ArtistCard: React.FC<{ artist: Artist }> = ({ artist }) => (
  <Link to={`/artiste/${artist.id}`} className="block group relative overflow-hidden rounded-lg shadow-lg aspect-[4/5]">
    <WatermarkedImage 
        src={artist.imageUrl} 
        {...generatePexelsSrcSet(artist.imageUrl)}
        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
        alt={artist.name} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        loading="lazy" 
        decoding="async"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
    
    <div className="absolute inset-0 p-6 flex flex-col justify-end transition-opacity duration-300 group-hover:opacity-0">
      <h3 className="text-2xl font-playfair font-bold text-white">{artist.name}</h3>
      <p className="text-alaiz-gold-light">{artist.role}</p>
    </div>

    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-alaiz-gold font-bold text-lg border-2 border-alaiz-gold px-4 py-2 rounded-full">Voir le profil</span>
    </div>
  </Link>
);

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => (
    <div className="bg-alaiz-gray p-8 rounded-lg text-center flex flex-col items-center border border-alaiz-gold/20 hover:border-alaiz-gold/50 transition-colors duration-300 h-full">
        <service.icon className="w-12 h-12 text-alaiz-gold mb-4" />
        <h3 className="text-xl font-bold font-playfair text-alaiz-gold-light">{service.title}</h3>
        <p className="mt-2 text-alaiz-cream/70 flex-grow">{service.description}</p>
    </div>
);

const AmbianceGenerator: React.FC<{ artists: Artist[] }> = ({ artists }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
    
    const { playCustomPlaylist, currentTrack, isPlaying } = useMusicPlayer();

    const allSongs = useMemo(() => {
        return artists.flatMap(artist =>
            artist.discography.map(song => ({
                ...song,
                artistName: artist.name,
            }))
        );
    }, [artists]);

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
        <div className="max-w-3xl mx-auto bg-alaiz-gray p-8 rounded-lg border border-alaiz-gold/20">
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: 'Une soirée jazz relaxante entre amis', 'Motivation pour travailler', 'Un dimanche après-midi mélancolique'..."
                rows={3}
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
        {playlist.length > 0 && (
            <div className="max-w-3xl mx-auto space-y-4 mt-12">
                <h3 className="text-2xl font-playfair font-bold text-center text-alaiz-gold-light mb-4">Votre Playlist Personnalisée</h3>
                {playlist.map((track, index) => (
                     <div 
                        key={index} 
                        className={`flex items-center p-4 rounded-lg transition-all duration-300 animate-fade-in-up ${currentTrack?.title === track.title && currentTrack.artistName === track.artistName ? 'bg-alaiz-gold/20' : 'bg-alaiz-gray hover:bg-alaiz-dark'}`}
                        style={{animationDelay: `${index * 0.1}s`}}
                     >
                        <WatermarkedImage src={track.coverUrl} alt={track.title} className="w-16 h-16 rounded-md object-cover mr-4 shadow-md" loading="lazy" decoding="async"/>
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
        )}
      </>
    )
}

const LabelPageSkeleton: React.FC = () => (
    <>
        <Section title="Nos Artistes Phares" subtitle="Des talents uniques qui incarnent l'esprit de notre label.">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-alaiz-gray rounded-lg aspect-[4/5]"></div>
                ))}
            </div>
        </Section>
        <Section title="Actualités Récentes" subtitle="Les dernières sorties, annonces et événements du label.">
            <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-alaiz-gray p-6 rounded-lg flex items-start gap-6">
                        <div className="h-20 w-20 bg-alaiz-dark rounded-md flex-shrink-0"></div>
                        <div className="flex-grow space-y-3">
                            <div className="h-8 bg-alaiz-dark rounded w-3/4"></div>
                            <div className="h-4 bg-alaiz-dark rounded w-full"></div>
                            <div className="h-4 bg-alaiz-dark rounded w-5/6"></div>
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    </>
);


const LabelPage: React.FC = () => {
  const [data, setData] = useState<{
    artists: Artist[],
    services: Service[],
    labelInfo: { director: string, legalForm: string, publicationDirector: string, name: string, address: string, emails: { contact: string} },
    labelAbout: LabelAbout,
    news: NewsItem[],
    pressKit: PressKit,
    bookingBlock: BookingBlock,
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slogan, setSlogan] = useState("L'histoire, la vision et les talents qui font A Laiz Prod.");


  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setLoading(true);
        const [artists, services, labelInfo, slogans, labelAbout, news, pressKit, bookingBlock] = await Promise.all([
          getArtists(),
          getServices(),
          getLabelInfo(),
          getPageSlogans(),
          getLabelAbout(),
          getNews(),
          getPressKit(),
          getBookingBlock(),
        ]);
        // FIX: Convert readonly arrays to mutable arrays before setting state.
        setData({ artists: [...artists], services: [...services], labelInfo, labelAbout, news: [...news], pressKit, bookingBlock });
        setSlogan(slogans.label);
      } catch (err) {
        setError("Impossible de charger les informations du label.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPageData();
  }, []);

  return (
    <>
      <MetaTags
        title="Le Label"
        description="Découvrez l'histoire, la mission et les artistes talentueux qui forment le cœur du label musical A Laiz Prod."
        keywords="artistes, production musicale, histoire du label"
      />
      <div className="pt-32 pb-16 bg-alaiz-gray/50">
          <div className="container mx-auto px-6">
              <div className="mb-4"><BackButton /></div>
              <div className="text-center">
                <h1 className="text-5xl md:text-6xl font-playfair font-extrabold text-alaiz-gold-light">Notre Label</h1>
                <p className="mt-4 text-xl text-alaiz-cream/80 max-w-3xl mx-auto">{slogan}</p>
              </div>
          </div>
      </div>
      
      {loading && <LabelPageSkeleton />}
      {error && <ErrorDisplay message={error} />}

      {data && !loading && (
        <>
          <Section
            title="Notre Histoire & Mission"
            subtitle={data.labelAbout.mission}
          >
            <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2 text-lg leading-relaxed text-alaiz-cream/90 space-y-6">
                <p>{data.labelAbout.histoire}</p>
              </div>
              <div className="bg-alaiz-gray p-6 rounded-lg border-l-4 border-alaiz-gold">
                  <h4 className="font-bold text-xl text-alaiz-gold-light mb-3">Nos Valeurs</h4>
                  <ul className="space-y-2">
                      {data.labelAbout.valeurs.map(valeur => (
                          <li key={valeur} className="flex items-center gap-3">
                              <CheckCircleIcon className="w-6 h-6 text-alaiz-gold flex-shrink-0" />
                              <span>{valeur}</span>
                          </li>
                      ))}
                  </ul>
              </div>
            </div>
          </Section>
          
          <div className="bg-alaiz-dark">
            <Section
                title="Nos Artistes Phares"
                subtitle="Des talents uniques qui incarnent l'esprit de notre label."
            >
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.artists.map(artist => <ArtistCard key={artist.id} artist={artist} />)}
                </div>
            </Section>
          </div>

          <Section
            title="Actualités Récentes"
            subtitle="Les dernières sorties, annonces et événements du label."
          >
            <div className="max-w-4xl mx-auto space-y-8">
              {data.news.map(item => (
                <div key={item.title} className="bg-alaiz-gray p-6 rounded-lg flex items-start gap-6 border border-transparent hover:border-alaiz-gold/20 transition-all">
                  <div className="text-center flex-shrink-0 pr-6 border-r border-alaiz-dark">
                    <p className="text-4xl font-bold text-alaiz-gold-light">{new Date(item.date).toLocaleDateString('fr-FR', { day: '2-digit' })}</p>
                    <p className="text-alaiz-cream/70 -mt-1">{new Date(item.date).toLocaleDateString('fr-FR', { month: 'short' })}.</p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-playfair font-bold text-alaiz-cream hover:text-alaiz-gold-light transition-colors"><Link to={item.link}>{item.title}</Link></h3>
                    <p className="mt-2 text-alaiz-cream/80">{item.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section
              title="Structure & Transparence"
              subtitle="Toutes les informations sur notre structure pour une collaboration en toute confiance."
          >
              <div className="max-w-3xl mx-auto bg-alaiz-gray p-8 rounded-lg border border-alaiz-gold/20 text-lg">
                  <ul className="space-y-4">
                      <li className="flex items-start gap-4"><BuildingOfficeIcon className="w-6 h-6 text-alaiz-gold mt-1 flex-shrink-0" /><span className="font-semibold text-alaiz-cream/80 w-48 shrink-0">Raison Sociale:</span> <span className="text-alaiz-cream">{data.labelInfo.name}</span></li>
                      <li className="flex items-start gap-4"><BuildingOfficeIcon className="w-6 h-6 text-alaiz-gold mt-1 flex-shrink-0" /><span className="font-semibold text-alaiz-cream/80 w-48 shrink-0">Forme Juridique:</span> <span className="text-alaiz-cream">{data.labelInfo.legalForm}</span></li>
                      <li className="flex items-start gap-4"><UserIcon className="w-6 h-6 text-alaiz-gold mt-1 flex-shrink-0" /><span className="font-semibold text-alaiz-cream/80 w-48 shrink-0">Dir. de la Publication:</span> <span className="text-alaiz-cream">{data.labelInfo.publicationDirector}</span></li>
                      <li className="flex items-start gap-4"><MapPinIcon className="w-6 h-6 text-alaiz-gold mt-1 flex-shrink-0" /><span className="font-semibold text-alaiz-cream/80 w-48 shrink-0">Siège Social:</span> <span className="text-alaiz-cream">{data.labelInfo.address}</span></li>
                      <li className="flex items-start gap-4"><EnvelopeIcon className="w-6 h-6 text-alaiz-gold mt-1 flex-shrink-0" /><span className="font-semibold text-alaiz-cream/80 w-48 shrink-0">Contact Principal:</span> <a href={`mailto:${data.labelInfo.emails.contact}`} className="text-alaiz-gold hover:underline break-all">{data.labelInfo.emails.contact}</a></li>
                  </ul>
              </div>
          </Section>

          <div className="bg-alaiz-dark">
              <Section
                  title="Kit Presse"
                  subtitle={data.pressKit.short_text}
              >
                <div className="max-w-3xl mx-auto bg-alaiz-gray p-8 rounded-lg text-center">
                  <h3 className="text-3xl font-playfair font-bold text-alaiz-gold-light">{data.pressKit.headline}</h3>
                  <div className="mt-6 flex flex-wrap justify-center gap-4">
                    {data.pressKit.assets.map(asset => (
                      <a key={asset} href={`/assets/${asset}`} download className="flex items-center gap-2 bg-alaiz-dark px-6 py-3 rounded-full font-semibold hover:bg-alaiz-black hover:text-alaiz-gold transition-colors">
                        <DownloadIcon className="w-5 h-5"/>
                        <span>{asset.split('_').join(' ').replace(/\.(png|pdf|zip|jpg)/, '')}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </Section>
          </div>

          <Section
              title="Créez Votre Ambiance Sonore"
              subtitle="Décrivez un moment, une émotion, et laissez notre IA composer la bande-son parfaite à partir de notre catalogue."
          >
              <AmbianceGenerator artists={data.artists} />
          </Section>

          <div className="bg-alaiz-dark">
            <Section
              title="Nos Prestations"
              subtitle="Des services professionnels pour tous vos besoins musicaux."
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {data.services.map(service => <ServiceCard key={service.id} service={service} />)}
              </div>
            </Section>
          </div>

           <Section
                title={data.bookingBlock.title}
                subtitle="Nous sommes toujours ouverts à de nouvelles collaborations. Contactez-nous pour discuter de votre projet."
            >
              <div className="text-center">
                 <Link 
                    to={`mailto:${data.bookingBlock.contact_email}`}
                    className="mt-2 inline-block bg-alaiz-gold text-alaiz-black font-bold text-lg px-10 py-4 rounded-full border-2 border-transparent hover:bg-transparent hover:text-alaiz-gold hover:border-alaiz-gold transition-all duration-300 transform hover:scale-105"
                  >
                   {data.bookingBlock.cta_text}
                  </Link>
              </div>
          </Section>
        </>
      )}
    </>
  );
};

export default LabelPage;