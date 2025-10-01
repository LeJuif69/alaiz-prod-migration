import React from 'react';
import { Link } from 'react-router-dom';
import ParticleBackground from './ParticleBackground';

const Hero: React.FC = () => {
  return (
    <div className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden snap-start">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute z-0 w-auto min-w-full min-h-full max-w-none"
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-pianist-playing-a-grand-piano-on-stage-1645-large.mp4" type="video/mp4" />
        Votre navigateur ne supporte pas la balise vidéo.
      </video>
      <div className="absolute inset-0 z-5">
        <ParticleBackground />
      </div>
      <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
      <div className="relative z-20 px-4 animate-fade-in-up">
        <h1 
          className="text-5xl md:text-7xl lg:text-8xl font-playfair font-black tracking-wider leading-tight bg-gradient-to-r from-alaiz-white via-alaiz-gold-light to-alaiz-white bg-clip-text text-transparent animate-shine-effect"
          style={{ backgroundSize: '200% auto' }}
        >
          Tradition. Innovation. Émotion.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-alaiz-cream/90 max-w-2xl mx-auto">
          A Laiz Prod fusionne l'âme du gospel, l'élégance du jazz et la richesse des musiques africaines pour créer des expériences sonores inoubliables.
        </p>
        <Link 
          to="/label"
          className="mt-10 inline-block bg-alaiz-gold text-alaiz-black font-bold text-lg px-10 py-4 rounded-full border-2 border-transparent hover:bg-transparent hover:text-alaiz-gold hover:border-alaiz-gold transition-all duration-300 transform hover:scale-105"
        >
          Découvrir le Label
        </Link>
      </div>
    </div>
  );
};

export default Hero;