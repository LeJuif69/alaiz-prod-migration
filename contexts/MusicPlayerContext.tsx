
import React, { createContext, useState, useRef, useContext, useEffect, useCallback } from 'react';
import type { Artist, DiscographyItem } from '../types';

interface PlaylistItem extends DiscographyItem {
    artistName: string;
}

interface MusicPlayerContextType {
    isPlaying: boolean;
    currentTrack: PlaylistItem | null;
    playArtistPlaylist: (artist: Artist, trackIndex: number) => void;
    playCustomPlaylist: (playlist: PlaylistItem[], trackIndex: number) => void;
    handlePlayPause: () => void;
    handleNext: () => void;
    handlePrev: () => void;
    handleSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
    duration: number;
    currentTime: number;
    volume: number;
    handleVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    toggleMute: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export const MusicPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
    const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1);
    const [previousVolume, setPreviousVolume] = useState(1);

    const currentTrack = currentTrackIndex !== null ? playlist[currentTrackIndex] : null;

    const handleNext = useCallback(() => {
        if (playlist.length === 0) return;
        setCurrentTrackIndex(prevIndex => {
            if (prevIndex === null) return 0;
            return (prevIndex + 1) % playlist.length;
        });
        setIsPlaying(true);
    }, [playlist.length]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const setAudioData = () => {
            setDuration(audio.duration);
            setCurrentTime(audio.currentTime);
        };

        const setAudioTime = () => setCurrentTime(audio.currentTime);

        audio.addEventListener('loadeddata', setAudioData);
        audio.addEventListener('timeupdate', setAudioTime);
        audio.addEventListener('ended', handleNext);

        return () => {
            audio.removeEventListener('loadeddata', setAudioData);
            audio.removeEventListener('timeupdate', setAudioTime);
            audio.removeEventListener('ended', handleNext);
        };
    }, [currentTrack, handleNext]); 

    useEffect(() => {
        if (currentTrack && audioRef.current) {
             if (isPlaying) {
                audioRef.current?.play().catch(error => {
                    // Ignore AbortError which is thrown when a play() request is interrupted by a new load request.
                    // This is expected behavior when changing tracks quickly.
                    if (error.name !== 'AbortError') {
                        console.error("Error playing audio:", error);
                    }
                });
            } else {
                audioRef.current?.pause();
            }
        }
    }, [isPlaying, currentTrack]);

    const playArtistPlaylist = (artist: Artist, trackIndex: number) => {
        const newPlaylist = artist.discography.map(track => ({
            ...track,
            artistName: artist.name,
        }));
        setPlaylist(newPlaylist);
        setCurrentTrackIndex(trackIndex);
        setIsPlaying(true);
    };

    const playCustomPlaylist = (customPlaylist: PlaylistItem[], trackIndex: number) => {
        setPlaylist(customPlaylist);
        setCurrentTrackIndex(trackIndex);
        setIsPlaying(true);
    };

    const handlePlayPause = () => {
        if (currentTrackIndex === null) return;
        setIsPlaying(!isPlaying);
    };

    const handlePrev = () => {
        if (playlist.length === 0) return;
        setCurrentTrackIndex(prevIndex => {
            if (prevIndex === null) return 0;
            return (prevIndex - 1 + playlist.length) % playlist.length;
        });
        setIsPlaying(true);
    };
    
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(audioRef.current) {
            audioRef.current.currentTime = Number(e.target.value);
            setCurrentTime(audioRef.current.currentTime);
        }
    }

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (newVolume > 0) {
            setPreviousVolume(newVolume);
        }
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    const toggleMute = () => {
        if (volume > 0) {
            setPreviousVolume(volume);
            setVolume(0);
            if (audioRef.current) audioRef.current.volume = 0;
        } else {
            const newVolume = previousVolume > 0 ? previousVolume : 0.5;
            setVolume(newVolume);
            if (audioRef.current) audioRef.current.volume = newVolume;
        }
    };

    const value = {
        isPlaying,
        currentTrack,
        playArtistPlaylist,
        playCustomPlaylist,
        handlePlayPause,
        handleNext,
        handlePrev,
        handleSeek,
        duration,
        currentTime,
        volume,
        handleVolumeChange,
        toggleMute,
    };

    return (
        <MusicPlayerContext.Provider value={value}>
            <audio ref={audioRef} src={currentTrack?.audioSrc}></audio>
            {children}
        </MusicPlayerContext.Provider>
    );
};

export const useMusicPlayer = (): MusicPlayerContextType => {
    const context = useContext(MusicPlayerContext);
    if (context === undefined) {
        throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
    }
    return context;
};