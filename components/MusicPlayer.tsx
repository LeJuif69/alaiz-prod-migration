import React from 'react';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';
import { PlayIcon, PauseIcon, NextTrackIcon, PrevTrackIcon, VolumeIcon, VolumeMuteIcon } from './Icons';
import WatermarkedImage from './WatermarkedImage';

const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

const MusicPlayer: React.FC = () => {
    const { 
        isPlaying, 
        currentTrack, 
        handlePlayPause, 
        handleNext, 
        handlePrev,
        handleSeek,
        duration,
        currentTime,
        volume,
        handleVolumeChange,
        toggleMute
    } = useMusicPlayer();

    if (!currentTrack) {
        return null;
    }

    const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

    return (
        <div className="fixed bottom-0 left-0 right-0 h-24 bg-alaiz-gray/90 backdrop-blur-md border-t border-alaiz-gold/20 z-50 text-alaiz-cream p-4 flex items-center shadow-2xl shadow-black">
            <div className="flex items-center w-1/4">
                <WatermarkedImage src={currentTrack.coverUrl} alt={currentTrack.title} className="w-16 h-16 rounded-md object-cover mr-4" loading="lazy" decoding="async" />
                <div>
                    <p className="font-bold truncate">{currentTrack.title}</p>
                    <p className="text-sm text-alaiz-cream/70 truncate">{currentTrack.artistName}</p>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center w-1/2">
                <div className="flex items-center space-x-6">
                    <button onClick={handlePrev} aria-label="Piste précédente" className="text-alaiz-cream/70 hover:text-white transition-colors"><PrevTrackIcon className="w-6 h-6" /></button>
                    <button onClick={handlePlayPause} aria-label={isPlaying ? 'Pause' : 'Lecture'} className="bg-alaiz-gold text-alaiz-black rounded-full w-12 h-12 flex items-center justify-center hover:bg-alaiz-gold-light transition-colors transform hover:scale-105">
                        {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6 ml-1" />}
                    </button>
                    <button onClick={handleNext} aria-label="Piste suivante" className="text-alaiz-cream/70 hover:text-white transition-colors"><NextTrackIcon className="w-6 h-6" /></button>
                </div>
                 <div className="w-full max-w-md flex items-center space-x-2 mt-2">
                    <span className="text-xs text-alaiz-cream/70 w-10 text-right">{formatTime(currentTime)}</span>
                    <input
                        type="range"
                        value={currentTime}
                        step="1"
                        min="0"
                        max={duration || 0}
                        onChange={handleSeek}
                        aria-label="Curseur de lecture"
                        className="w-full h-1 bg-alaiz-gray rounded-lg appearance-none cursor-pointer"
                        style={{
                            background: `linear-gradient(to right, #D4AF37 ${progressPercentage}%, #2A2A2A ${progressPercentage}%)`
                        }}
                    />
                    <span className="text-xs text-alaiz-cream/70 w-10">{formatTime(duration)}</span>
                </div>
            </div>
            <div className="w-1/4 flex items-center justify-end">
                <button onClick={toggleMute} aria-label="Mute/Unmute" className="text-alaiz-cream/70 hover:text-white transition-colors">
                    {volume === 0 ? <VolumeMuteIcon className="w-6 h-6" /> : <VolumeIcon className="w-6 h-6" />}
                </button>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    aria-label="Volume"
                    className="w-24 h-1 bg-alaiz-gray rounded-lg appearance-none cursor-pointer ml-2"
                    style={{ background: `linear-gradient(to right, #D4AF37 ${volume * 100}%, #2A2A2A ${volume * 100}%)` }}
                />
            </div>
        </div>
    );
};

export default MusicPlayer;