

import React, { useState, useRef, useEffect, useCallback } from 'react';
import MetaTags from '../components/MetaTags';
import {
    SparklesIcon, MusicNoteIcon, MicrophoneIcon, StopIcon, DownloadIcon, PlayIcon, TrashIcon, UserIcon, KeyIcon, MetronomeIcon, RhythmIcon, InstrumentIcon, VoiceIcon, BookOpenIcon, HomeIcon, SlidersIcon, LibraryIcon, CogIcon, MenuIcon, XIcon, PlusIcon, HeartIcon, PauseIcon, VolumeIcon, VolumeMuteIcon
} from '../components/Icons';
import { generateMusicSimple, generateMusicAdvanced, SimpleMusicParams, AdvancedMusicParams } from '../services/musicGenerationService';
import { getPublicCreations } from '../services/cmsService';
import { useAuth } from '../contexts/AuthContext';
import { Creation } from '../types';
import BackButton from '../components/BackButton';

// --- Types ---
type GenerationState = 'idle' | 'loading' | 'success' | 'error';
type TrackType = 'instrumental' | 'voice' | 'loop';
type Mode = 'amateur' | 'musician';
type GombisteView = 'home' | 'create' | 'studio' | 'library' | 'settings';
type SortOption = 'date' | 'likes';

interface Track {
    id: number;
    name: string;
    type: TrackType;
    url: string;
    volume: number;
    pan: number;
    mute: boolean;
    solo: boolean;
}

interface AudioNode {
    audioEl: HTMLAudioElement;
    sourceNode: MediaElementAudioSourceNode;
    gainNode: GainNode;
    pannerNode: StereoPannerNode;
}

// --- Main Component ---
const TutorPage: React.FC = () => {
    const { currentUser, saveUserCreation } = useAuth();
    const [activeView, setActiveView] = useState<GombisteView>('home');
    const [generationMode, setGenerationMode] = useState<Mode>('amateur');
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    const [publicCreations, setPublicCreations] = useState<Creation[]>([]);
    const [libraryLoading, setLibraryLoading] = useState(false);
    const [likedCreations, setLikedCreations] = useState<Set<number>>(new Set());

    const handleNavigate = (view: GombisteView) => {
        setActiveView(view);
        setIsMobileNavOpen(false);
    };

    const handleSelectMode = (mode: Mode) => {
        setGenerationMode(mode);
        setActiveView('create');
    };

    // --- Studio State ---
    const [tracks, setTracks] = useState<Track[]>([]);
    const [generationState, setGenerationState] = useState<GenerationState>('idle');
    const [generationError, setGenerationError] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    // --- Web Audio API State ---
    const audioContextRef = useRef<AudioContext | null>(null);
    const trackNodesRef = useRef<Map<number, AudioNode>>(new Map());
    const masterGainRef = useRef<GainNode | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [masterVolume, setMasterVolume] = useState(0.8);
    const [playbackTime, setPlaybackTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const animationFrameRef = useRef<number>();

    // --- Initialize Audio Context ---
    useEffect(() => {
        if (!audioContextRef.current) {
            let context: AudioContext | null = null;
            if (window.AudioContext) {
                // FIX: The AudioContext constructor in modern browsers requires an options object.
                // Passing an empty object prevents the "Expected 1 arguments, but got 0" TypeError.
                context = new window.AudioContext({});
            } else if ((window as any).webkitAudioContext) {
                // For older browsers with the prefixed version, call without arguments.
                context = new (window as any).webkitAudioContext();
            }

            if (context) {
                audioContextRef.current = context;
                masterGainRef.current = context.createGain();
                masterGainRef.current.connect(context.destination);
                masterGainRef.current.gain.value = masterVolume;
            } else {
                console.error("Web Audio API is not supported in this browser.");
            }
        }
    }, [masterVolume]);
    
    useEffect(() => {
      if (masterGainRef.current) masterGainRef.current.gain.value = masterVolume;
    }, [masterVolume]);

    // --- Fetch Public Creations ---
    useEffect(() => {
        if (activeView === 'library') {
            setLibraryLoading(true);
            getPublicCreations()
                .then(creations => setPublicCreations([...creations]))
                .catch(err => console.error("Failed to load public creations", err))
                .finally(() => setLibraryLoading(false));
        }
    // FIX: Added missing dependency `activeView` to ensure this effect runs when the view changes.
    }, [activeView]);

    // --- Web Audio API Track Management ---
    const setupAudioNode = useCallback((track: Track): Promise<AudioNode> => {
        return new Promise((resolve) => {
            const context = audioContextRef.current;
            if (!context) throw new Error("Audio context not initialized");

            const audioEl = new Audio(track.url);
            audioEl.crossOrigin = "anonymous";
            audioEl.preload = "auto";
            
            audioEl.addEventListener('loadedmetadata', () => {
                const sourceNode = context.createMediaElementSource(audioEl);
                const gainNode = context.createGain();
                const pannerNode = context.createStereoPanner();
                
                gainNode.gain.value = track.volume;
                pannerNode.pan.value = track.pan;

                sourceNode.connect(gainNode).connect(pannerNode).connect(masterGainRef.current!);
                
                resolve({ audioEl, sourceNode, gainNode, pannerNode });
            });
        });
    }, []);

    const addTrack = useCallback(async (url: string, type: TrackType, name: string, prompt: string) => {
        setActiveView('studio');
        const newTrack: Track = { id: Date.now(), name, type, url, volume: 0.8, pan: 0, mute: false, solo: false };
        const node = await setupAudioNode(newTrack);
        trackNodesRef.current.set(newTrack.id, node);
        setTracks(prev => [...prev, newTrack]);
        if (currentUser && type !== 'voice') {
          await saveUserCreation({ prompt, url });
        }
    }, [currentUser, saveUserCreation, setupAudioNode]);

    const updateTrack = (id: number, updates: Partial<Track>) => {
        setTracks(prev => prev.map(t => {
            if (t.id === id) {
                const updatedTrack = { ...t, ...updates };
                const node = trackNodesRef.current.get(id);
                if (node) {
                    if (updates.volume !== undefined) node.gainNode.gain.value = updates.volume;
                    if (updates.pan !== undefined) node.pannerNode.pan.value = updates.pan;
                }
                return updatedTrack;
            }
            return t;
        }));
    };
    
    // --- Playback Controls ---
    const updatePlaybackTime = useCallback(() => {
        // FIX: Replaced unsafe `Array.from(...)[0]` with a direct iterator call (`.next().value`)
        // to prevent potential runtime errors and ensure correct type inference for `firstNode`.
        const firstNode = trackNodesRef.current.values().next().value;
        if (firstNode) {
            setPlaybackTime(firstNode.audioEl.currentTime);
            setDuration(firstNode.audioEl.duration || 0);
        }
        animationFrameRef.current = requestAnimationFrame(updatePlaybackTime);
    }, []);

    const playAll = () => {
        if (!audioContextRef.current || tracks.length === 0) return;
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }
        trackNodesRef.current.forEach(node => node.audioEl.play());
        setIsPlaying(true);
        animationFrameRef.current = requestAnimationFrame(updatePlaybackTime);
    };

    const stopAll = () => {
        trackNodesRef.current.forEach(node => {
            node.audioEl.pause();
            node.audioEl.currentTime = 0;
        });
        setIsPlaying(false);
        setPlaybackTime(0);
        if(animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
    
    const togglePlayPause = () => isPlaying ? stopAll() : playAll();

    // --- Library Actions ---
    const handleLike = (creationId: number) => {
        setLikedCreations(prev => {
            const newSet = new Set(prev);
            if (newSet.has(creationId)) newSet.delete(creationId);
            else newSet.add(creationId);
            return newSet;
        });
        setPublicCreations(prev => prev.map(c => {
            if (c.id === creationId) {
                const isLiked = !likedCreations.has(creationId);
                return { ...c, likes: (c.likes || 0) + (isLiked ? 1 : -1) };
            }
            return c;
        }));
    };

    const loadToStudio = (creation: Creation) => {
        addTrack(creation.url, 'loop', `Biblio: ${creation.prompt.substring(0, 20)}...`, creation.prompt);
    };
    
    const removeTrack = (id: number) => {
        const node = trackNodesRef.current.get(id);
        if (node) {
            node.audioEl.src = '';
            node.sourceNode.disconnect();
            trackNodesRef.current.delete(id);
        }
        setTracks(prev => prev.filter(t => t.id !== id));
    };
    
    // --- Render ---
    const renderView = () => {
        switch (activeView) {
            case 'home': return <HomeView onSelectMode={handleSelectMode} />;
            case 'create': return <CreateView mode={generationMode} setMode={setGenerationMode} addTrack={addTrack} />;
            case 'studio': return <StudioView tracks={tracks} updateTrack={updateTrack} removeTrack={removeTrack} isRecording={isRecording} mediaRecorderRef={mediaRecorderRef} addTrack={addTrack} isPlaying={isPlaying} togglePlayPause={togglePlayPause} stopAll={stopAll} masterVolume={masterVolume} setMasterVolume={setMasterVolume} playbackTime={playbackTime} duration={duration} />;
            case 'library': return <LibraryView currentUserCreations={currentUser?.creations || []} publicCreations={publicCreations} loading={libraryLoading} likedCreations={likedCreations} onLike={handleLike} onLoadToStudio={loadToStudio} />;
            case 'settings': return <SettingsView onClearProject={() => { stopAll(); setTracks([]); trackNodesRef.current.clear(); }}/>;
            default: return <HomeView onSelectMode={handleSelectMode} />;
        }
    };

    return (
        <>
            <MetaTags title="Gombiste IA Studio" description="Composez, enregistrez et mixez vos pistes directement dans votre navigateur." />
            <div className="pt-32 pb-16 bg-alaiz-dark min-h-screen">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="flex justify-between items-center mb-4">
                      <BackButton />
                      <button className="md:hidden text-alaiz-gold" onClick={() => setIsMobileNavOpen(true)}><MenuIcon className="w-8 h-8"/></button>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
                        <GombisteSidebar activeView={activeView} onNavigate={handleNavigate} isMobileOpen={isMobileNavOpen} setMobileOpen={setIsMobileNavOpen} />
                        <main className="flex-1 min-w-0">
                            <div key={activeView} className="animate-fade-in-up" style={{animationDuration: '0.3s'}}>
                                {renderView()}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
};

// --- Child Components for TutorPage ---

const GombisteSidebar: React.FC<{activeView: GombisteView, onNavigate: (v: GombisteView) => void, isMobileOpen: boolean, setMobileOpen: (o: boolean) => void}> = ({activeView, onNavigate, isMobileOpen, setMobileOpen}) => {
    const NavItem: React.FC<{ view: GombisteView, label: string, icon: React.ElementType }> = ({ view, label, icon: Icon }) => (
        <button
            onClick={() => onNavigate(view)}
            className={`flex items-center w-full px-3 py-3 rounded-lg transition-colors duration-200 text-sm md:flex-col md:text-xs md:h-20 md:justify-center md:px-1 lg:flex-row lg:h-auto lg:justify-start lg:text-sm lg:px-3 ${
                activeView === view ? 'bg-alaiz-gold/10 text-alaiz-gold-light' : 'text-alaiz-cream/70 hover:bg-alaiz-gray hover:text-alaiz-cream'
            }`}
        >
            <Icon className="w-5 h-5 mr-3 md:mr-0 md:mb-1 lg:mr-3 lg:mb-0" />
            <span className="font-semibold">{label}</span>
        </button>
    );

    const menuContent = (
      <>
        <h2 className="text-xl font-playfair font-bold text-alaiz-gold-light mb-4 px-2 hidden md:block">Gombiste IA</h2>
        <nav className="space-y-2">
            <NavItem view="home" label="Accueil" icon={HomeIcon} />
            <NavItem view="create" label="Créer" icon={SparklesIcon} />
            <NavItem view="studio" label="Studio" icon={SlidersIcon} />
            <NavItem view="library" label="Bibliothèque" icon={LibraryIcon} />
            <NavItem view="settings" label="Paramètres" icon={CogIcon} />
        </nav>
      </>
    );

    return (
      <>
        {/* Mobile */}
        <div className={`fixed inset-0 bg-alaiz-black/50 z-50 transition-opacity md:hidden ${isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setMobileOpen(false)}></div>
        <aside className={`fixed top-0 left-0 h-full bg-alaiz-gray w-64 p-4 z-50 transform transition-transform md:hidden ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-alaiz-cream/70"><XIcon className="w-6 h-6"/></button>
          {menuContent}
        </aside>

        {/* Desktop */}
        <aside className="hidden md:block md:w-20 lg:w-52 flex-shrink-0 bg-alaiz-gray p-3 rounded-lg self-start sticky top-28">
           {menuContent}
        </aside>
      </>
    );
};

const HomeView: React.FC<{ onSelectMode: (mode: Mode) => void }> = ({ onSelectMode }) => (
    <div className="text-center p-4">
        <h1 className="text-4xl md:text-5xl font-playfair font-extrabold text-alaiz-gold-light">Bienvenue sur Gombiste IA</h1>
        <p className="mt-3 text-lg text-alaiz-cream/80 max-w-2xl mx-auto">Votre studio de création, propulsé par l'IA. Comment voulez-vous commencer ?</p>
        <div className="mt-12 grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div onClick={() => onSelectMode('amateur')} className="bg-alaiz-gray p-8 rounded-lg border-2 border-alaiz-gold/20 hover:border-alaiz-gold hover:scale-105 transition-all duration-300 cursor-pointer">
                <UserIcon className="w-16 h-16 mx-auto text-alaiz-gold" />
                <h2 className="text-2xl font-playfair font-bold text-alaiz-gold-light mt-4">Mode Amateur</h2>
                <p className="mt-2 text-alaiz-cream/80 text-sm">Décrivez simplement la musique que vous imaginez, et laissez l'IA la créer pour vous.</p>
            </div>
            <div onClick={() => onSelectMode('musician')} className="bg-alaiz-gray p-8 rounded-lg border-2 border-alaiz-gold/20 hover:border-alaiz-gold hover:scale-105 transition-all duration-300 cursor-pointer">
                <MusicNoteIcon className="w-16 h-16 mx-auto text-alaiz-gold" />
                <h2 className="text-2xl font-playfair font-bold text-alaiz-gold-light mt-4">Mode Musicien</h2>
                <p className="mt-2 text-alaiz-cream/80 text-sm">Prenez le contrôle total. Définissez le style, le tempo, les instruments et la structure.</p>
            </div>
        </div>
    </div>
);

const CreateView: React.FC<{mode: Mode, setMode: (m: Mode | ((prev: Mode) => Mode)) => void, addTrack: Function}> = ({ mode, setMode, addTrack }) => {
    const [generationState, setGenerationState] = useState<GenerationState>('idle');
    const [generationError, setGenerationError] = useState('');

    const handleGenerate = async (params: SimpleMusicParams | AdvancedMusicParams) => {
        setGenerationState('loading');
        setGenerationError('');
        try {
            const trackName = mode === 'amateur' ? `Amateur: ${(params as SimpleMusicParams).style}` : `Musicien: ${(params as AdvancedMusicParams).instruments[0]}`;
            const url = mode === 'amateur' ? await generateMusicSimple(params as SimpleMusicParams) : await generateMusicAdvanced(params as AdvancedMusicParams);
            addTrack(url, 'instrumental', trackName, params.prompt);
            setGenerationState('success');
        } catch (error: any) {
            setGenerationError(error.message || `Erreur de génération.`);
            setGenerationState('error');
        }
    };
    
    return (
        <div className="bg-alaiz-gray p-6 rounded-lg border border-alaiz-gold/20 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-2xl font-playfair font-bold text-alaiz-gold-light">Créer une piste</h2>
                 {/* FIX: Explicitly typed the state setter function parameter for type safety. */}
                 <button onClick={() => setMode((m: Mode) => m === 'amateur' ? 'musician' : 'amateur')} className="text-sm text-alaiz-gold hover:underline">
                     Passer en mode {mode === 'amateur' ? 'Musicien' : 'Amateur'}
                 </button>
            </div>
            {mode === 'amateur' ? <AmateurForm onSubmit={handleGenerate} isLoading={generationState === 'loading'} /> : <MusicianForm onSubmit={handleGenerate} isLoading={generationState === 'loading'} />}
            {generationState === 'loading' && <p className="text-center mt-2 text-alaiz-gold-light animate-pulse">Génération en cours... (cela peut prendre 20-30s)</p>}
            {generationError && <p className="text-center mt-2 text-red-400">{generationError}</p>}
        </div>
    );
}

const StudioView: React.FC<any> = ({ tracks, updateTrack, removeTrack, addTrack, isPlaying, togglePlayPause, stopAll, masterVolume, setMasterVolume, playbackTime, duration }) => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder|null>(null);

    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            const audioChunks: Blob[] = [];
            mediaRecorderRef.current.ondataavailable = e => audioChunks.push(e.data);
            mediaRecorderRef.current.onstop = () => {
                const voiceBlob = new Blob(audioChunks, { type: 'audio/webm' });
                addTrack(URL.createObjectURL(voiceBlob), 'voice', `Enregistrement Voix ${new Date().toLocaleTimeString()}`, 'Enregistrement vocal');
                stream.getTracks().forEach(track => track.stop());
            };
            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) { alert("Erreur d'accès au microphone."); }
    };
    
    const handleStopRecording = () => { mediaRecorderRef.current?.stop(); setIsRecording(false); };
    const formatTime = (s: number) => new Date(s * 1000).toISOString().substr(14, 5);

    return (
        <div className="bg-alaiz-gray p-4 sm:p-6 rounded-lg border border-alaiz-gold/20">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-alaiz-gold/20">
                <h2 className="text-2xl font-playfair font-bold text-alaiz-gold-light">Studio de Mixage</h2>
                <div className="flex items-center gap-2">
                    {!isRecording ?
                        <button onClick={handleStartRecording} title="Enregistrer la voix" className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 text-sm">
                            <MicrophoneIcon className="w-4 h-4" /> REC
                        </button>
                        :
                        <button onClick={handleStopRecording} className="flex items-center gap-2 px-4 py-2 bg-red-800 text-white font-bold rounded-full animate-pulse text-sm">
                            <StopIcon className="w-4 h-4" /> STOP
                        </button>
                    }
                    <button onClick={() => {}} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 text-sm"><DownloadIcon className="w-4 h-4" /> Exporter</button>
                </div>
            </div>

            {/* Master Controls */}
            <div className="bg-alaiz-dark rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <button onClick={togglePlayPause} className="p-3 bg-alaiz-gold text-alaiz-black rounded-full hover:bg-alaiz-gold-light">{isPlaying ? <PauseIcon className="w-6 h-6"/> : <PlayIcon className="w-6 h-6"/>}</button>
                    <button onClick={stopAll} className="p-3 bg-alaiz-gray rounded-full hover:bg-alaiz-black"><StopIcon className="w-6 h-6"/></button>
                </div>
                <div className="flex items-center gap-2 text-sm font-mono w-full sm:w-auto">
                    <span>{formatTime(playbackTime)}</span>
                    <div className="w-full h-1 bg-alaiz-black rounded"><div className="h-1 bg-alaiz-gold rounded" style={{width: `${(playbackTime/duration)*100}%`}}></div></div>
                    <span>{formatTime(duration)}</span>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                    <VolumeIcon className="w-5 h-5" />
                    <input type="range" min="0" max="1" step="0.01" value={masterVolume} onChange={e => setMasterVolume(Number(e.target.value))} className="w-24"/>
                </div>
            </div>

            <div className="space-y-3">
                {tracks.length > 0 ? (
                    tracks.map(track => <TrackItem key={track.id} track={track} onUpdate={updateTrack} onRemove={removeTrack} />)
                ) : (
                    <div className="text-center py-16 border-2 border-dashed border-alaiz-dark rounded-lg">
                        <SlidersIcon className="w-16 h-16 mx-auto text-alaiz-cream/20" />
                        <p className="mt-4 text-alaiz-cream/60 text-lg">Votre studio est vide.</p>
                        <p className="text-alaiz-cream/50">Utilisez la section "Créer" pour commencer.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const TrackItem: React.FC<{ track: Track, onUpdate: (id: number, updates: Partial<Track>) => void, onRemove: (id: number) => void }> = ({ track, onUpdate, onRemove }) => (
    <div className="p-3 bg-alaiz-dark/70 rounded-lg flex items-center gap-4 border-l-4 border-alaiz-gold/50 animate-fade-in-up">
        <div className="flex-grow">
            <p className="font-bold text-alaiz-cream text-sm truncate">{track.name}</p>
        </div>
        <div className="flex flex-col items-center w-24">
            <label className="text-xs text-alaiz-cream/70">Volume</label>
            <input type="range" min="0" max="1" step="0.01" value={track.volume} onChange={e => onUpdate(track.id, { volume: +e.target.value })} className="w-full"/>
        </div>
        <div className="flex flex-col items-center w-24">
            <label className="text-xs text-alaiz-cream/70">Pan</label>
            <input type="range" min="-1" max="1" step="0.01" value={track.pan} onChange={e => onUpdate(track.id, { pan: +e.target.value })} className="w-full"/>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={() => onUpdate(track.id, { mute: !track.mute })} className={`px-2 py-1 text-xs font-bold rounded ${track.mute ? 'bg-red-500' : 'bg-alaiz-gray'}`}>M</button>
            <button onClick={() => onUpdate(track.id, { solo: !track.solo })} className={`px-2 py-1 text-xs font-bold rounded ${track.solo ? 'bg-yellow-500' : 'bg-alaiz-gray'}`}>S</button>
        </div>
        <button onClick={() => onRemove(track.id)} className="p-2 hover:bg-red-900/50 rounded-full"><TrashIcon className="w-5 h-5 text-red-400" /></button>
    </div>
);


const AmateurForm: React.FC<any> = ({ onSubmit, isLoading }) => { /* ... same as before but without addTrack logic ... */ 
    const [prompt, setPrompt] = useState('Une mélodie de piano relaxante et mélancolique, style lo-fi.');
    const [lyrics, setLyrics] = useState('');
    const [style, setStyle] = useState('Lo-fi');

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit({ prompt, lyrics, style }); }} className="space-y-4">
            <div>
                <label className="flex items-center gap-2 mb-2 font-bold text-alaiz-gold"><SparklesIcon className="w-5 h-5"/>Description</label>
                <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={4} placeholder="Ex: Une piste de jazz entraînante..." className="w-full bg-alaiz-dark p-3 rounded-md focus:ring-alaiz-gold focus:border-alaiz-gold" required />
            </div>
             <div>
                <label className="flex items-center gap-2 mb-2 font-bold text-alaiz-cream/80"><BookOpenIcon className="w-5 h-5"/>Paroles (optionnel)</label>
                <textarea value={lyrics} onChange={e => setLyrics(e.target.value)} rows={3} placeholder="Ajoutez des paroles..." className="w-full bg-alaiz-dark p-3 rounded-md" />
            </div>
             <div>
                <label className="flex items-center gap-2 mb-2 font-bold text-alaiz-cream/80"><MusicNoteIcon className="w-5 h-5"/>Style</label>
                <input type="text" value={style} onChange={e => setStyle(e.target.value)} placeholder="Ex: Gospel, Jazz, Afrobeat" className="w-full bg-alaiz-dark p-3 rounded-md" />
            </div>
            <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-3 py-3 px-4 bg-alaiz-gold text-alaiz-black font-bold rounded-full hover:bg-alaiz-gold-light transition-colors disabled:opacity-50">
                Générer et ajouter au studio <SparklesIcon className="w-5 h-5" />
            </button>
        </form>
    );
};

const MusicianForm: React.FC<any> = ({ onSubmit, isLoading }) => { /* ... same as before but without addTrack logic ... */ 
    const [params, setParams] = useState<AdvancedMusicParams>({ prompt: 'Un morceau de jazz fusion avec une ligne de basse proéminente.', key: 'La mineur', tempo: 120, rhythm: '4/4', instruments: ['Piano électrique', 'Basse fretless', 'Batterie', 'Saxophone'], voice: 'Aucune', duration: 60, version: 'instrumental' });
    const handleChange = (field: keyof AdvancedMusicParams, value: any) => setParams(p => ({ ...p, [field]: value }));
    return (
        <form onSubmit={(e) => {e.preventDefault(); onSubmit(params);}} className="space-y-4 text-sm">
             <div>
                <label className="flex items-center gap-2 mb-2 font-bold text-alaiz-gold"><SparklesIcon className="w-5 h-5"/>Prompt Principal</label>
                <textarea value={params.prompt} onChange={e => handleChange('prompt', e.target.value)} rows={3} className="w-full bg-alaiz-dark p-2 rounded-md" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div><label className="flex items-center gap-2 mb-1"><KeyIcon className="w-4 h-4"/>Tonalité</label><input type="text" value={params.key} onChange={e => handleChange('key', e.target.value)} className="w-full bg-alaiz-dark p-2 rounded-md" /></div>
                <div><label className="flex items-center gap-2 mb-1"><MetronomeIcon className="w-4 h-4"/>Tempo (BPM)</label><input type="number" value={params.tempo} onChange={e => handleChange('tempo', +e.target.value)} className="w-full bg-alaiz-dark p-2 rounded-md" /></div>
                <div><label className="flex items-center gap-2 mb-1"><RhythmIcon className="w-4 h-4"/>Rythme</label><input type="text" value={params.rhythm} onChange={e => handleChange('rhythm', e.target.value)} className="w-full bg-alaiz-dark p-2 rounded-md" /></div>
                <div><label className="flex items-center gap-2 mb-1">Durée (sec)</label><input type="number" value={params.duration} onChange={e => handleChange('duration', +e.target.value)} className="w-full bg-alaiz-dark p-2 rounded-md" /></div>
            </div>
            <div><label className="flex items-center gap-2 mb-1"><InstrumentIcon className="w-4 h-4"/>Instruments</label><input type="text" value={params.instruments.join(', ')} onChange={e => handleChange('instruments', e.target.value.split(',').map(s => s.trim()))} className="w-full bg-alaiz-dark p-2 rounded-md" /></div>
            <div><label className="flex items-center gap-2 mb-1"><VoiceIcon className="w-4 h-4"/>Voix</label><select value={params.voice} onChange={e => handleChange('voice', e.target.value)} className="w-full bg-alaiz-dark p-2 rounded-md"><option>Aucune</option><option>Homme</option><option>Femme</option><option>Enfant</option><option>Chœur</option></select></div>
            <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-3 py-3 px-4 bg-alaiz-gold text-alaiz-black font-bold rounded-full hover:bg-alaiz-gold-light transition-colors disabled:opacity-50">
                Générer et ajouter au studio <SparklesIcon className="w-5 h-5" />
            </button>
        </form>
    );
};

const LibraryView: React.FC<any> = ({currentUserCreations, publicCreations, loading, likedCreations, onLike, onLoadToStudio}) => {
    const [activeTab, setActiveTab] = useState<'personal' | 'public'>('public');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('date');
    const { currentUser } = useAuth();
    
    const filterAndSort = (creations: Creation[]) => {
        return creations
            .filter(c => c.prompt.toLowerCase().includes(searchTerm.toLowerCase()) || c.userName?.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a,b) => {
                if (sortBy === 'likes') return (b.likes || 0) - (a.likes || 0);
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            });
    }

    const personalCreations = filterAndSort(currentUserCreations);
    const filteredPublicCreations = filterAndSort(publicCreations);

    return (
        <div className="bg-alaiz-gray p-4 sm:p-6 rounded-lg border border-alaiz-gold/20">
            <h2 className="text-2xl font-playfair font-bold text-alaiz-gold-light mb-4">Bibliothèque Musicale</h2>
            <div className="border-b border-alaiz-gold/20 mb-4 flex items-center gap-4">
                <button onClick={() => setActiveTab('public')} className={`py-2 px-4 font-semibold ${activeTab === 'public' ? 'border-b-2 border-alaiz-gold text-alaiz-gold-light' : 'text-alaiz-cream/70'}`}>Bibliothèque Publique</button>
                <button onClick={() => setActiveTab('personal')} className={`py-2 px-4 font-semibold ${activeTab === 'personal' ? 'border-b-2 border-alaiz-gold text-alaiz-gold-light' : 'text-alaiz-cream/70'}`}>Mes Créations</button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input type="text" placeholder="Rechercher par prompt ou créateur..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="flex-grow bg-alaiz-dark p-2 rounded-md" />
                <select value={sortBy} onChange={e => setSortBy(e.target.value as SortOption)} className="bg-alaiz-dark p-2 rounded-md">
                    <option value="date">Trier par date</option>
                    <option value="likes">Trier par popularité</option>
                </select>
            </div>
            
            {loading ? <p>Chargement...</p> : (
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                   {(activeTab === 'public' ? filteredPublicCreations : personalCreations).map(c => <CreationItem key={c.id} creation={c} isLiked={likedCreations.has(c.id)} onLike={onLike} onLoadToStudio={onLoadToStudio} />)}
                </div>
            )}

            {activeTab === 'personal' && !currentUser && (
                 <div className="text-center py-12 border-2 border-dashed border-alaiz-dark rounded-lg">
                    <p className="text-alaiz-cream/60 text-lg">Connectez-vous pour voir vos créations.</p>
                </div>
            )}
        </div>
    );
};

const CreationItem: React.FC<any> = ({creation, isLiked, onLike, onLoadToStudio}) => (
    <div className="bg-alaiz-dark p-3 rounded-lg flex items-center gap-3">
        <audio src={creation.url} preload="metadata" className="hidden"></audio>
        <div className="flex-grow">
            <p className="font-semibold text-sm text-alaiz-cream truncate">{creation.prompt}</p>
            <p className="text-xs text-alaiz-cream/60">par {creation.userName || 'Moi'} • {new Date(creation.date).toLocaleDateString('fr-FR')}</p>
        </div>
        {creation.userName && ( // Only show likes for public creations
            <button onClick={() => onLike(creation.id)} className="flex items-center gap-1 text-sm text-alaiz-cream/70">
                <HeartIcon className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-current' : ''}`} /> {creation.likes || 0}
            </button>
        )}
        <button onClick={() => onLoadToStudio(creation)} title="Ajouter au studio" className="p-2 hover:bg-alaiz-gold/20 rounded-full"><PlusIcon className="w-5 h-5 text-alaiz-gold"/></button>
    </div>
);

const SettingsView: React.FC<{onClearProject: () => void}> = ({onClearProject}) => (
     <div className="bg-alaiz-gray p-6 rounded-lg border border-alaiz-gold/20 max-w-2xl mx-auto">
        <h2 className="text-2xl font-playfair font-bold text-alaiz-gold-light mb-6">Paramètres</h2>
        <div className="space-y-6">
            <div>
                <label className="font-bold text-alaiz-cream/80">Qualité d'export</label>
                <select className="w-full bg-alaiz-dark p-2 rounded-md mt-2">
                    <option>MP3 - 128kbps (Standard)</option>
                    <option>MP3 - 320kbps (Haute Qualité)</option>
                    <option>WAV (Sans perte)</option>
                </select>
            </div>
            <div>
                 <h3 className="font-bold text-alaiz-cream/80 mb-2">Gestion du projet</h3>
                 <button onClick={onClearProject} className="px-4 py-2 bg-red-800 text-white font-bold rounded-md hover:bg-red-700 text-sm">Vider le projet actuel</button>
                 <p className="text-xs text-alaiz-cream/60 mt-1">Attention, cette action est irréversible et supprimera toutes les pistes non sauvegardées.</p>
            </div>
        </div>
     </div>
);

export default TutorPage;