import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArtistById } from '../services/cmsService';
import Section from '../components/Section';
import type { DiscographyItem, VideoItem, Artist } from '../types';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';
import { PlayIcon } from '../components/Icons';
import MetaTags from '../components/MetaTags';
import Loader from '../components/Loader';
import ErrorDisplay from '../components/ErrorDisplay';
import BackButton from '../components/BackButton';
import WatermarkedImage from '../components/WatermarkedImage';

const generatePexelsSrcSet = (baseUrl: string, aspectRatio: number) => {
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
            params.set('h', Math.round(w * aspectRatio).toString());
            return `${base}?${params.toString()} ${w}w`;
        }).join(', ');
        
        return { srcSet: srcset };
    } catch (e) {
        console.error("Invalid URL for srcset generation:", baseUrl, e);
        return {};
    }
};

const DiscographyCard: React.FC<{ item: DiscographyItem; onClick: () => void }> = ({ item, onClick }) => (
    <div className="group relative cursor-pointer" onClick={onClick}>
        <WatermarkedImage 
            src={item.coverUrl} 
            {...generatePexelsSrcSet(item.coverUrl, 1)}
            sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
            alt={item.title} 
            className="w-full aspect-square object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105" 
            loading="lazy" 
            decoding="async" 
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
            <PlayIcon className="w-12 h-12 text-white" />
        </div>
        <div className="mt-2 text-center">
            <h4 className="font-bold text-alaiz-cream text-lg group-hover:text-alaiz-gold-light transition-colors truncate">{item.title}</h4>
            <p className="text-sm text-alaiz-cream/70">{item.year} &bull; {item.type}</p>
        </div>
    </div>
);

const VideoPlayer: React.FC<{ item: VideoItem }> = ({ item }) => (
    <div>
        <div className="aspect-video w-full overflow-hidden rounded-lg shadow-lg">
            <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${item.youtubeId}`}
                title={item.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
        <h4 className="mt-4 font-bold text-alaiz-gold-light text-xl text-center">{item.title}</h4>
    </div>
);


const ArtistPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { playArtistPlaylist } = useMusicPlayer();

  useEffect(() => {
    if (!id) return;
    const fetchArtist = async () => {
      try {
        setLoading(true);
        const fetchedArtist = await getArtistById(Number(id));
        if (fetchedArtist) {
          setArtist(fetchedArtist);
        } else {
          setError("L'artiste demandé n'a pas été trouvé.");
        }
      } catch (err) {
        setError("Impossible de charger les informations de l'artiste.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArtist();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 pb-16">
        <Loader message="Chargement du profil de l'artiste..." />
      </div>
    );
  }
  
  if (error || !artist) {
    return (
        <div className="container mx-auto px-6 py-24 text-center">
          <MetaTags title="Artiste non trouvé" />
          <ErrorDisplay message={error || "Artiste non trouvé"} />
          <Link to="/label" className="mt-8 inline-block bg-alaiz-gold text-alaiz-black font-bold px-6 py-3 rounded-full hover:bg-alaiz-gold-light transition-colors">
            Retour au Label
          </Link>
        </div>
    );
  }
  
  const handlePlayTrack = (trackIndex: number) => {
    if (artist) {
        playArtistPlaylist(artist, trackIndex);
    }
  };

  return (
      <div className="pt-32 pb-16">
        <MetaTags
            title={artist.name}
            description={artist.bio}
            keywords={`${artist.name}, ${artist.role}, artiste camerounais`}
            ogImage={artist.imageUrl}
        />
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="mb-8">
            <BackButton to="/label" />
          </div>
          
          <header className="grid md:grid-cols-3 gap-8 md:gap-12 items-center mb-16">
            <div className="md:col-span-1">
                <WatermarkedImage 
                    src={artist.imageUrl} 
                    {...generatePexelsSrcSet(artist.imageUrl, 5/4)}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    alt={artist.name} 
                    className="w-full h-auto aspect-[4/5] object-cover rounded-lg shadow-2xl shadow-alaiz-gold/10"
                    loading="lazy"
                    decoding="async"
                />
            </div>
            <div className="md:col-span-2">
                <h1 className="text-5xl md:text-7xl font-playfair font-extrabold text-alaiz-gold-light">{artist.name}</h1>
                <p className="text-xl text-alaiz-cream/80 mt-2">{artist.role}</p>
            </div>
          </header>

          <Section
            title="Biographie"
            subtitle={`Découvrez le parcours de ${artist.name}.`}
          >
            <div className="max-w-4xl mx-auto text-alaiz-cream/90 leading-relaxed space-y-6 text-lg">
                {artist.detailedBio.split('\n').map((paragraph, index) => (
                    paragraph.trim() && <p key={index}>{paragraph}</p>
                ))}
            </div>
          </Section>

          {artist.discography.length > 0 && (
            <div className="bg-alaiz-gray my-16 rounded-lg">
                <Section
                    title="Discographie"
                    subtitle={`Explorez la musique de ${artist.name}.`}
                >
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                        {artist.discography.map((item, index) => <DiscographyCard key={item.title} item={item} onClick={() => handlePlayTrack(index)} />)}
                    </div>
                </Section>
            </div>
          )}

          {artist.videos.length > 0 && (
            <Section
                title="Vidéos"
                subtitle="Plongez dans l'univers visuel de l'artiste."
            >
                <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {artist.videos.map(video => <VideoPlayer key={video.youtubeId} item={video} />)}
                </div>
            </Section>
          )}

        </div>
      </div>
  );
};

export default ArtistPage;