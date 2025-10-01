import React, { useState, useEffect } from 'react';
import { ChevronUpIcon } from './Icons';

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={`
        fixed bottom-6 right-6 z-50
        bg-alaiz-gold text-alaiz-black rounded-full p-3 shadow-lg
        transition-all duration-300 ease-in-out
        hover:bg-alaiz-gold-light hover:scale-110
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-alaiz-black focus:ring-alaiz-gold-light
        ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
      aria-label="Retour en haut"
      title="Retour en haut"
    >
      <ChevronUpIcon className="w-6 h-6" />
    </button>
  );
};

export default ScrollToTopButton;
